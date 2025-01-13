import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3 from '@/lib/s3Bucket'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(request: NextRequest) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
    const {fileName,fileType} = await request.json()
    try {
    if(!fileName || !fileType) throw new Error("FileName and FileType are required")
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: fileName,
            ContentType: "application/octet-stream",
        });

        const signedUrl = await getSignedUrl(S3
            ,
             command,
              { expiresIn: 3600 });
        
        return NextResponse.json({
            message: "The signed url is generated successfully",
            url: signedUrl
        },{
            status: 200
        })
    }
    catch (error: any) {
        return NextResponse.json({
            message: "The singed url can't be generated",
            error: error.message,
            url: ''
        },{
            status: 500
        })
    }
}
