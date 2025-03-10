// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      throw new Error("Admin supabase not found");
    }
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const userType = formData.get("userType") as string;
    const age = formData.get("age") as string;
    const locationName = formData.get("locationName") as string;
    const gender = formData.get("gender") as string;
    const userId = formData.get("userId") as string;

    if (userType !== "general" && (!age || parseInt(age) < 18)) {
      return NextResponse.json(
        { message: "Must be 18 or older to register.", success: false }, // Added success: false
        { status: 400 },
      );
    }
    if (!userId || userId.trim() === "") {
      console.error("Missing userId from form data");
      return NextResponse.json(
        { message: "Missing user ID.", success: false },
        { // Added success: false
          status: 400,
        },
      );
    }
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.error("Invalid userId format:", userId);
      return NextResponse.json({
        message: "Invalid user ID format.",
        success: false,
      }, { // Added success: false
        status: 400,
      });
    }

    const userDataToInsert: Database["public"]["Tables"]["users"]["Insert"] = {
      id: userId,
      username,
      email,
      user_type: userType,
      age: age != null ? parseInt(age) : null,
      is_verified: false,
      gender,
      location_name: locationName || null,
      interested_services: undefined,
    };
    if (!locationName?.trim()) {
      delete userDataToInsert.location_name;
    }
    if (userDataToInsert.age == null) delete userDataToInsert.age;

    const { data: insertedUser, error: userInsertError } = await supabaseAdmin
      .from("users")
      .insert([userDataToInsert])
      .select()
      .single();

    if (userInsertError) {
      console.error("Supabase user insert error:", userInsertError);
      return NextResponse.json({
        message: userInsertError.message,
        success: false,
      }, { // Added success: false
        status: 400,
      });
    }

    return NextResponse.json({
      message: "Signup successful! Please check your email for verification.",
      userId: insertedUser.id,
      success: true, // Added success: true
    }, { status: 200 }); // Added status: 200 for success
  } catch (error: any) {
    console.error("Signup API error:", error);
    const message = error?.message || "Internal Server Error";
    return NextResponse.json({ message, success: false }, { status: 500 }); // Added success: false
  }
}

export const runtime = "edge"
