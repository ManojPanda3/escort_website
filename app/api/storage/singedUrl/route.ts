import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3 from "@/lib/s3Bucket";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { decode } from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, userId } = await request.json();

    if (!supabaseAdmin) throw new Error("Admin supabase not found");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, {
        status: 400,
      });
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select(
        "id,current_offer,user_type,total_media,current_offer:offers(id,max_media)",
      )
      .eq("id", userId)
      .single();
    if (userError) throw new Error("Error wile fetching given user data");
    let maxMediaAllowed = 2;
    if (userData.current_offer) {
      maxMediaAllowed += userData.current_offer.max_media;
    }
    if (
      !userData?.id ||
      userData.total_media >= maxMediaAllowed
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!fileName || !fileType) {
      throw new Error("FileName and FileType are required");
    }

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
    const { error: mediaUpdateError } = await supabaseAdmin
      .from("users")
      .update({ total_media: userData.total_media + 1 })
      .eq("id", userData?.id);
    if (mediaUpdateError) {
      throw new Error("Error while updating total media count of the user");
    }
    const publicUrl = process.env.R2_PUBLIC_URL || "";

    return NextResponse.json({
      message: "The signed url is generated successfully",
      url: signedUrl,
      publicUrl,
    }, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "The signed url can't be generated",
      error: error.message,
      url: "",
    }, {
      status: 500,
    });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Use getSession() for lightweight auth check
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Decode the JWT to get the user ID
  let userId: string | null = null;
  if (session.access_token) {
    try {
      const decodedToken: any = decode(session.access_token);
      userId = decodedToken?.sub; // 'sub' (subject) claim usually holds the user ID
      if (!userId) {
        return NextResponse.json({ error: "User ID not found in token" }, {
          status: 401,
        });
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } else {
    return NextResponse.json({ error: "No access token found" }, {
      status: 401,
    });
  }

  const { fileName } = await request.json();

  if (!fileName) {
    return NextResponse.json({ error: "FileName is required" }, {
      status: 400,
    });
  }

  try {
    if (!supabaseAdmin) throw new Error("Admin supabase not found");

    // Get the current total_media count.
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("total_media")
      .eq("id", userId) // Use the extracted userId
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return NextResponse.json(
        { error: "Error fetching user data" },
        { status: 500 },
      );
    }

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentMediaCount = userData.total_media;

    // Decrement media count *only if* it's greater than 0.
    if (currentMediaCount <= 0) {
      return NextResponse.json({ error: "No media to delete" }, {
        status: 400,
      });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName, // Use the full filename.
    });

    await S3.send(command);

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ total_media: currentMediaCount - 1 })
      .eq("id", userId); // Use the extracted userId

    if (updateError) {
      console.error("Error updating media count:", updateError);
      return NextResponse.json(
        { error: "Error updating media count" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "File deleted successfully",
    }, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json({
      message: "The file can't be deleted",
      error: error.message,
    }, {
      status: 500,
    });
  }
}
