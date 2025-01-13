import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleAIFileManager } from "@google/generative-ai/server"
import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@supabase/supabase-js'
import { PutObjectCommand } from "@aws-sdk/client-s3"
import S3 from '@/lib/s3Bucket'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set')
}

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const supabaesUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
seriviceRoleKey =  process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(
 supabaesUrl!,seriviceRoleKey!
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: `
You are an AI document checker.
You check age in the document and validate the documents.
If valid and age is present then put the data in respective position and put error as "", isValid:true.
Else if not isValid:false, error:"age not found or document not valid"
(put any message you want but it has to describe the error or missing stuff)
`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      isValid: { type: "boolean" },
      "Document Number": { type: "string" },
      age: { type: "string" },
      "type Of Document": { type: "string" },
      error: { type: "string" },
    },
    required: ["isValid", "Document Number", "age", "type Of Document", "error"],
  },
};

// Function to clear chat history asynchronously
async function clearChatHistory(chatSession: any) {
  try {
    await chatSession.reset();
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
}

const chatSession = model.startChat({
  generationConfig,
  history: [],
});

async function uploadToGemini(filePath: string, mimeType: string) {
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: path.basename(filePath),
  });
  return uploadResult.file;
}

async function uploadToS3(buffer: Buffer, fileName: string, mimeType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  });

  await S3.send(command);
  return `${process.env.R2_BUCKET_NAME}/${fileName}`;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  let filePath: string | null = null;

  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string
    const userType = formData.get('userType') as string
    const age = formData.get('age') as string
    const ageProof = formData.get('ageProof') as File

    if (!age || parseInt(age) < 18) {
      return NextResponse.json({ message: 'Must be 18 or older to register.' }, { status: 400 })
    }

    // Validate Email and Username in parallel
    const [{ data: existingUsers }] = await Promise.all([
      supabase
        .from('users')
        .select('id, email, username')
        .or(`email.eq.${email},username.eq.${username}`)
    ]);

    if (existingUsers?.length) {
      const exists = existingUsers[0];
      if (exists.email === email) {
        return NextResponse.json({ message: 'User with this email already exists.' }, { status: 400 })
      }
      if (exists.username === username) {
        return NextResponse.json({ message: 'Username already exists.' }, { status: 400 })
      }
    }

    const userData = {
      username,
      email,
      user_type: userType,
      age: parseInt(age)
    } as any

    let uploadPromise: Promise<string> | null = async() =>{}
  

    if (userType !== 'general') {
      if (!ageProof) {
        return NextResponse.json({ message: 'Age proof file is required for this user type.' }, { status: 400 })
      }

      // Save file to tmp directory
      const bytes = await ageProof.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const tmpDir = path.join(process.cwd(), 'tmp')
      const fileName = `${uuidv4()}_${ageProof.name}`
      filePath = path.join(tmpDir, fileName)

      await writeFile(filePath, buffer)
      const geminiFile = await uploadToGemini(filePath, ageProof.type)
      const result = await chatSession.sendMessage(`Age Proof Document URI: ${geminiFile.uri}`);
      const responseJson = JSON.parse(result.response.text());
      if (!responseJson.isValid || responseJson.error !== '') {
          throw new Error(`Invalid document: ${responseJson.error}`);
      }

      const extractedAge = parseInt(responseJson.age);
      const providedAge = parseInt(age);
      if (Math.abs(extractedAge - providedAge) > 2) {
        throw new Error("Provided age doesn't match the age proof document");
      }

      // Start S3 upload in parallel
      uploadPromise = uploadToS3(buffer, fileName, ageProof.type);
    }

    // Start user signup process in parallel
    const [signupResult, s3Url] = await Promise.all([
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            type: userType,
          },
        },
      }),
      uploadPromise,
    ]);

    const { data, error: signupError } = signupResult;
    
    if (signupError) {
      return NextResponse.json({ message: signupError.message }, { status: 400 })
    }

    if (!data?.user?.id) {
      throw new Error('Failed to create user')
    }

    userData.id = data.user.id
    if (s3Url) {
      userData.age_proof = s3Url;
    }

    // Insert User into the 'users' table
    const { error: userInsertError } = await supabase
      .from('users')
      .insert([userData])

    if (userInsertError) {
      return NextResponse.json({ message: userInsertError.message }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Signup successful! Please check your email for verification.',
      redirect: '/auth/login'
    })

  } catch (error: any) {
    const message = error?.message || 'Internal Server Error'
    return NextResponse.json({ message }, { status: 500 })
  } finally {
    // Clean up the temporary file if it exists
    if (filePath) {
      try {
        await unlink(filePath)
      } catch (error) {
        console.error('Error deleting temporary file:', error)
      }
    }
  }
}
