import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database.types";
import { assert } from "node:console";
import { supabaseAdmin } from "@/lib/supabase";


export async function PUT(request: NextRequest) {
  try {
    assert(supabaseAdmin, "server error supabaseAdmin is not defined")
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // Check for session errors first
    if (sessionError) {
      return NextResponse.json({
        success: false,
        ok: false,
        error: "Authentication Error",
        message: sessionError.message,
      }, { status: 401 }); // Unauthorized
    }

    if (!session) {
      return NextResponse.json({
        success: false,
        ok: false,
        error: "Unauthorized",
        message: "User is not authenticated.",
      }, { status: 401 }); // Unauthorized
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id,current_offer:offers(id,max_places),user_type,place_of_services")
      .eq("id", session.user.id)
      .single();

    if (userError) {
      return NextResponse.json({
        success: false,
        ok: false,
        error: "Database Error",
        message: `Error fetching user data: ${userError.message}`,
      }, { status: 500 }); // Internal Server Error
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        ok: false,
        error: "User Not Found",
        message: "User data could not be retrieved.",
      }, { status: 404 }); // Not Found
    }


    if (user.current_offer == null || user.user_type === "general") {
      return NextResponse.json({
        success: false,
        ok: false,
        error: "Unauthorized",
        message: user.current_offer ? "You do not have an active offer." : "General users are not authorized to perform this action.",
      }, { status: 403 }); // Forbidden (using 403 to differentiate from session-related 401)
    }

    // NOTE: this is to check if theres any bugs and we are leting free users use this service
    assert(user.current_offer, "current_offer is required");

    const total_service_allowed: number = (user.current_offer.max_places || 0) - (user.place_of_services?.length || 0);

    // Corrected status code to 403 (Forbidden)
    if (total_service_allowed <= 0) {
      return NextResponse.json({
        success: false,
        ok: false,
        error: "Quota Exceeded",
        message: "You have reached your maximum allowed service places.  Please upgrade your plan or purchase additional quota.",
      }, { status: 403 }); // Forbidden
    }

    const data = await request.json();
    const place_of_services = data["place_of_services"] as string[] | null | undefined;

    if (!place_of_services) {
      return NextResponse.json({
        success: false,
        ok: false,
        error: "Invalid Input",
        message: "The 'place_of_services' field is required and cannot be empty.",
      }, { status: 400 }); // Bad Request
    }
    //check place_of_services length
    if (place_of_services.length > total_service_allowed) {
      return NextResponse.json({
        success: false,
        ok: false,
        error: "Quota Exceeded",
        message: `You can add a maximum of ${total_service_allowed} service places. You tried to add ${place_of_services.length}.`,
      }, { status: 403 });// Forbidden
    }
    if (!place_of_services.every(place => typeof place === 'string')) {
      return NextResponse.json({
        success: false,
        ok: false,
        error: "Invalid Input",
        message: "The 'place_of_services' must be an array of strings.",
      }, { status: 400 }); // Bad Request
    }

    const { error: dbError } = await supabaseAdmin
      .from("users")
      .update({
        place_of_services
      }).eq("id", session.user.id)

    if (dbError) {
      return NextResponse.json({
        success: false,
        ok: false,
        error: "Database Error",
        message: `Error updating user data: ${dbError.message}`,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ok: true,
      message: "Place of service added successfully.",
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json({
      success: false,
      ok: false,
      error: "Internal Server Error",
      message: `An unexpected error occurred: ${errorMessage}`,
    }, { status: 500 }); // Internal Server Error
  }
}
