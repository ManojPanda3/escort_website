import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      throw new Error("Admin supabase not found");
    }
    console.log("Incoming request body:", await request.clone().formData());
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const userType = formData.get("userType") as string;
    const age = formData.get("age") as string;
    const location = formData.get("location") as string;
    const locationName = formData.get("locationName") as string;
    const gender = formData.get("gender") as string;
    const userId = formData.get("userId") as string;
    const interested_servicesString = formData.get(
      "interested_services",
    ) as string; // Get as string

    if (userType !== "general" && (!age || parseInt(age) < 18)) {
      return NextResponse.json(
        { message: "Must be 18 or older to register." },
        { status: 400 },
      );
    }
    if (!userId || userId.trim() === "") {
      console.error("Missing userId from form data");
      return NextResponse.json({ message: "Missing user ID." }, {
        status: 400,
      });
    }
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i; // Basic UUID regex
    if (!uuidRegex.test(userId)) {
      console.error("Invalid userId format:", userId);
      return NextResponse.json({ message: "Invalid user ID format." }, {
        status: 400,
      });
    }

    // Parse categories and services from JSON strings to JavaScript arrays
    let interested_services: string[] = [];

    if (interested_servicesString) {
      try {
        interested_services = JSON.parse(interested_servicesString) as string[];
      } catch (parseError) {
        console.error("Error parsing interested_services JSON:", parseError);
        return NextResponse.json(
          { message: "Invalid interested services format." },
          { status: 400 },
        );
      }
    }

    const userDataToInsert = {
      id: userId,
      username,
      email,
      user_type: userType,
      age: age != null ? parseInt(age) : null,
      is_verified: false,
      location,
      gender,
      location_name: locationName,
      interested_services: interested_services, // Use the parsed array
    };
    if (!location?.trim()) {
      delete userDataToInsert.location;
    }
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
      return NextResponse.json({ message: userInsertError.message }, {
        status: 400,
      });
    }

    return NextResponse.json({
      message: "Signup successful! Please check your email for verification.",
      userId: insertedUser.id,
    });
  } catch (error: any) {
    console.error("Signup API error:", error);
    const message = error?.message || "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
