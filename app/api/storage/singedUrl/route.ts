import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3 from "@/lib/s3Bucket";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { decode, JwtPayload } from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, userId } = await request.json();

    if (!supabaseAdmin) {
      throw new Error("Server configuration error: Supabase admin client not initialized.");
    }

    if (!userId) {
      return NextResponse.json({ error: "Bad Request: User ID is required." }, { status: 400 });
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, current_offer, user_type, total_media, current_offer:offers(id,max_media)")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Supabase user data fetch error:", userError);  // Log for debugging
      return NextResponse.json({ error: "Internal Server Error: Failed to fetch user data." }, { status: 500 });
    }

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized: User not found." }, { status: 404 }); // Or 401, depending on preference
    }


    let maxMediaAllowed = 2;
    if (userData.current_offer) {
      maxMediaAllowed += userData.current_offer.max_media;
    }

    if (userData.total_media >= maxMediaAllowed) {
      return NextResponse.json({ error: "Forbidden: Media limit reached." }, { status: 403 }); // 403 is appropriate for exceeding limits
    }

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Bad Request: fileName and fileType are required." }, { status: 400 });
    }

    // Construct a more robust Key
    const key = `user/${userId}/${Date.now()}-${fileName}`;


    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key, // Use the constructed key
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

    // Update media count *after* getting the signed URL (but before returning it)
    const { error: mediaUpdateError } = await supabaseAdmin
      .from("users")
      .update({ total_media: userData.total_media + 1 })
      .eq("id", userData.id);

    if (mediaUpdateError) {
      // Consider *not* throwing here, but logging and returning a 500 error.
      // The signed URL *was* generated, but the DB update failed.  Throwing could
      // make retries problematic.
      console.error("Supabase media update error:", mediaUpdateError);
      return NextResponse.json({ error: "Internal Server Error: Failed to update media count." }, { status: 500 });
    }

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`; // Construct the public URL with the Key


    return NextResponse.json({
      message: "Signed URL generated successfully.",
      url: signedUrl,
      publicUrl, // Return the constructed public URL
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in POST handler:", error); // Always log the full error
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized: No session found." }, { status: 401 });
    }

    let userId: string | null = null;
    if (session.access_token) {
      try {
        const decodedToken = decode(session.access_token) as JwtPayload | null; // Use JwtPayload
        userId = decodedToken?.sub;
        if (!userId) {
          return NextResponse.json({ error: "Unauthorized: User ID not found in token." }, { status: 401 });
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return NextResponse.json({ error: "Unauthorized: Invalid token." }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Unauthorized: No access token found." }, { status: 401 });
    }

    const { fileName } = await request.json();
    if (!fileName) {
      return NextResponse.json({ error: "Bad Request: FileName is required." }, { status: 400 });
    }


    if (!supabaseAdmin) {
      throw new Error("Server configuration error: Supabase admin client not initialized.");
    }

    // Get the current total_media count.
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("total_media")
      .eq("id", userId) // Use the extracted userId
      .single();

    if (userError) {
      console.error("Supabase user data fetch error:", userError);
      return NextResponse.json({ error: "Internal Server Error: Failed to fetch user data." }, { status: 500 });
    }

    if (!userData) {
      return NextResponse.json({ error: "Not Found: User not found." }, { status: 404 });
    }

    const currentMediaCount = userData.total_media;

    // Decrement media count *only if* it's greater than 0.
    if (currentMediaCount <= 0) {
      return NextResponse.json({ error: "Bad Request: No media to delete." }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName, // Use the full filename.
    });

    try {
      await S3.send(command);
    } catch (deleteError: any) {
      console.error("S3 delete error:", deleteError);
      // Handle specific S3 errors (e.g., NoSuchKey) if needed
      return NextResponse.json({ error: "Internal Server Error: Failed to delete file from storage." }, { status: 500 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ total_media: currentMediaCount - 1 })
      .eq("id", userId); // Use the extracted userId

    if (updateError) {
      console.error("Supabase media count update error:", updateError);
      // Again, consider *not* throwing, but logging and returning a 500.
      return NextResponse.json({ error: "Internal Server Error: Failed to update media count." }, { status: 500 });
    }

    return NextResponse.json({ message: "File deleted successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
