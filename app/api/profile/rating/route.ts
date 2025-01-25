import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }

    const body = await request.json();
    const { escortId, rating } = body;

    if (!escortId || rating === undefined) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: escort, error: escortError } = await supabaseAdmin
        .from("users")
        .select("id, ratings")
        .eq("id", escortId)
        .single();

    if (escortError || !escort) {
        return NextResponse.json({ error: "Escort not found" }, { status: 404 });
    }

    const currentRating = escort.ratings || 0;
    const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({ ratings: 1+currentRating})
        .eq("id", escortId);

    if (updateError) {
        return NextResponse.json({ error: "Failed to update rating" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}
