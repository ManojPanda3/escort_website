import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { createStoryTablesIfNotExist, createUserTablesIfNotExist, supabase } from '@/lib/supabase'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleAIFileManager } from "@google/generative-ai/server"

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(path: string, mimeType: any) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: `
you  are an ai document checker.
  you check age in the document and validate the documents.
  if valid and age is present then put the data in respective position and put error as \"\", isvalid:true. 
  else if not isvalid:false , error:\"age not found or document not valid\"
  (put any message u want but it has to describe the error or missing stuff)
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

export async function POST(request: NextRequest) {
  const email = formData.get('email') as string
  try {
    const formData = await request.formData()
    const password = formData.get('password') as string
    const username = formData.get('username') as string
    const userType = formData.get('userType') as string
    const age = formData.get('age') as string
    const ageProof = formData.get('ageProof') as File | null

    createUserTablesIfNotExist()
    createStoryTablesIfNotExist()

    // Validate Email
    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingEmail) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 400 })
    }

    // Validate Username
    const { data: existingUsername } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUsername) {
      return NextResponse.json({ message: 'Username already exists.' }, { status: 400 })
    }

    // Validate Age or Age Proof
    let ageProofPath = null
    if (userType === 'general' && !age) {
      return NextResponse.json({ message: 'Age is required for general user type.' }, { status: 400 })
    }
    if (userType !== 'general' && !ageProof) {
      return NextResponse.json({ message: 'Age proof is required for this user type.' }, { status: 400 })
    }

    let extractedAge = age || null;

    if (ageProof) {
      const buffer = Buffer.from(await ageProof.arrayBuffer())
      const filename = `${Date.now()}_${ageProof.name}`
      const tmpDir = path.join(process.cwd(), 'tmp')

      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true })
      }

      const filepath = path.join(tmpDir, filename)
      fs.writeFileSync(filepath, buffer)

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
      const uploadedFile = uploadToGemini(tmpDir + filename, "image/webp")
      const result = await chatSession.sendMessage(`Age Proof Document: ${uploadedFile.uri}`);

      const response = result.response.text();
      console.log(response)
      const responseJson = JSON.parse(response);

      if (!responseJson.isValid) {
        throw new Error(`Invalid document: ${responseJson.error}`);
      }

      extractedAge = responseJson.age || extractedAge; // Extract age from the response
      fs.unlinkSync(filepath); // Cleanup the uploaded file after validation
    }

    // Signup User
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          type: userType,
          age: extractedAge || null,
          age_proof: ageProofPath,
        },
      },
    })

    if (signupError) {
      return NextResponse.json({ message: signupError.message }, { status: 400 })
    }

    // Insert User into the 'users' table
    const { data: userInsertData, error: userInsertError } = await supabase
      .from('users') // public.users table
      .insert([
        {
          id: data?.user.id, // Use the user ID from signup
          username,
          email,
          user_type: userType,
          age: extractedAge || null,
        },
      ])

    if (userInsertError) {
      return NextResponse.json({ message: userInsertError.message }, { status: 400 })
    }

    // Login User Immediately After Signup
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) {
      return NextResponse.json({ message: loginError.message }, { status: 400 })
    }

    const { session } = loginData

    // Set Access and Refresh Tokens as Cookies
    const response = NextResponse.json({
      message: 'Signup successful! Please check your email for verification.',
    })

    if (session) {
      response.cookies.set('access_token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
      response.cookies.set('refresh_token', session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
    }

    return response
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

