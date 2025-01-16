import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3 from '@/lib/s3Bucket';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, userId } = await request.json();

    if (!supabaseAdmin) throw new Error("Admin supabase not found");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw new Error(userError.message);
    if (!userData?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!fileName || !fileType) throw new Error("FileName and FileType are required");

    const { data: ageProofArray, error: ageProofError } = await supabaseAdmin
      .from('age_proof')
      .select('*')
      .eq('owner', userId);

    if (ageProofArray && ageProofArray.length > 0) {
      // For users with age proof, check current offer
      if (!userData.current_offer) {
        return NextResponse.json({
          error: "Limit exceeded for current plan"
        }, { status: 400 });
      }

      const { data: offer, error: offerError } = await supabaseAdmin
        .from("offers")
        .select("*")
        .eq("id", userData.current_offer)
        .single();

      if (offerError) {
        return NextResponse.json({
          error: "Error fetching offer details"
        }, { status: 400 });
      }

      if (!offer) {
        return NextResponse.json({
          error: "Offer not found"
        }, { status: 404 });
      }

      if (offer.max_media <= userData.total_media) {
        return NextResponse.json({
          error: "Limit exceeded for current plan"
        }, { status: 400 });
      }
    }

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(S3,
      command,
      { expiresIn: 3600 });
    const publicUrl = process.env.R2_PUBLIC_URL || ''

    return NextResponse.json({
      message: "The signed url is generated successfully",
      url: signedUrl,
      publicUrl
    }, {
      status: 200
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "The signed url can't be generated",
      error: error.message,
      url: ''
    }, {
      status: 500
    });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { fileName } = await request.json();
  try {
    if (!fileName) throw new Error("FileName is required");
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName
    });

    const signedUrl = await getSignedUrl(S3,
      command,
      { expiresIn: 3600 });

    return NextResponse.json({
      message: "The signed delete url is generated successfully",
      url: signedUrl
    }, {
      status: 200
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "The signed delete url can't be generated",
      error: error.message,
      url: ''
    }, {
      status: 500
    });
  }
}
