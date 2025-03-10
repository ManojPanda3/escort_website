import Stripe from "stripe";
import checkAdmin from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

// POST: Add a new offer and create a corresponding Stripe price
export async function POST(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json(
        { message: "Unauthorized access", error: "Unauthorized access" },
        { status: 401 },
      );
    }
    if (!supabaseAdmin) throw new Error("Failed to start Supabase as admin");

    const newOffer = await request.json();
    delete newOffer.id;

    // Input Validation
    if (!newOffer.billing_cycle || !["weekly", "yearly", "monthly"].includes(newOffer.billing_cycle)) {
      return NextResponse.json(
        { error: "Invalid billing cycle", message: "Billing cycle must be weekly, yearly, or monthly" },
        { status: 400 },
      );
    }

    if (!newOffer.features || !Array.isArray(newOffer.features) || newOffer.features.length === 0) {
      return NextResponse.json(
        { error: "Invalid features", message: "Features must be a non-empty array" },
        { status: 400 },
      );
    }

    if (typeof newOffer.price !== 'number' || isNaN(newOffer.price) || newOffer.price <= 0) {
      return NextResponse.json(
        { error: "Invalid price", message: "Price must be a number greater than 0" },
        { status: 400 },
      );
    }
    // Convert price to number if it's a string
    newOffer.price = Number(newOffer.price);

    if (!newOffer.type || typeof newOffer.type !== "string") {
      return NextResponse.json(
        { error: "Invalid type", message: "Type must be a string" },
        { status: 400 },
      );
    }

    if (typeof newOffer.isvip_included !== "boolean") {
      return NextResponse.json(
        { error: "Invalid isvip_included", message: "isvip_included must be a boolean" },
        { status: 400 },
      );
    }

    if (newOffer.isvip_included) {
      // If isvip_included is true, max_media and max_places can be >= 0
      if (
        (typeof newOffer.max_media !== "number" || newOffer.max_media < 0) && newOffer.max_media !== null ||
        (typeof newOffer.max_places !== "number" || newOffer.max_places < 0) && newOffer.max_places !== null
      ) {
        return NextResponse.json(
          { error: "Invalid max_media or max_places", message: "max_media and max_places must be >= 0 when isvip_included is true, or null" },
          { status: 400 },
        );
      }
    } else {
      // If isvip_included is false, max_media and max_places must be > 0
      if (
        typeof newOffer.max_media !== "number" || newOffer.max_media <= 0 ||
        typeof newOffer.max_places !== "number" || newOffer.max_places <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid max_media or max_places", message: "max_media and max_places must be > 0 when isvip_included is false" },
          { status: 400 },
        );
      }
    }


    // Step 1: Create a Stripe product
    const product = await stripe.products.create({
      name: newOffer.type,
      description: `Features: ${newOffer.features.join(", ")}`,
    });

    // Step 2: Create a Stripe price for the product
    const price = await stripe.prices.create({
      unit_amount: newOffer.price * 100, // Stripe expects amounts in cents
      currency: "usd",
      recurring: {
        interval: newOffer.billing_cycle === "monthly" ? "month" : "year",
      },
      product: product.id,
    });

    // Step 3: Save the offer with Stripe product and price IDs
    const { error } = await supabaseAdmin
      .from("offers")
      .insert({
        ...newOffer,
        stripe_price_id: price.id,
        stripe_product_id: product.id,
      });
    if (error) throw error;

    return NextResponse.json({ error: null, message: "success" }, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, message: "failed" },
      { status: 500 },
    );
  }
}

// DELETE, PUT methods remain unchanged, as they don't have the same validation requirements.
// Just paste the DELETE and PUT methods from the previous answer here.

// ... (paste PUT and DELETE from previous answer) ...

export async function PUT(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json(
        { message: "Unauthorized access", error: "Unauthorized access" },
        { status: 401 },
      );
    }
    if (!supabaseAdmin) throw new Error("Failed to start Supabase as admin");

    const updatedOffer = await request.json();

    // Step 1: Update the Stripe product if it exists
    if (updatedOffer.stripe_product_id) {
      await stripe.products.update(updatedOffer.stripe_product_id, {
        name: updatedOffer.type,
        description: `Features: ${updatedOffer.features.join(", ")}`,
      });
    }

    // Step 2: Update or create the Stripe price
    if (!updatedOffer.stripe_price_id) {
      // Create a new price if one doesn't exist
      const price = await stripe.prices.create({
        unit_amount: updatedOffer.price * 100,
        currency: "usd",
        recurring: {
          interval: updatedOffer.billing_cycle === "monthly" ? "month" : "year",
        },
        product: updatedOffer.stripe_product_id,
      });
      updatedOffer.stripe_price_id = price.id;
    }

    // Step 3: Update the offer in the database
    const { error } = await supabaseAdmin
      .from("offers")
      .update(updatedOffer)
      .eq("id", updatedOffer.id);
    if (error) throw error;

    return NextResponse.json({ error: null, message: "success" }, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, message: "failed" },
      { status: 500 },
    );
  }
}

// DELETE: Delete an offer and its associated Stripe price and product
export async function DELETE(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json(
        { message: "Unauthorized access", error: "Unauthorized access" },
        { status: 401 },
      );
    }
    if (!supabaseAdmin) throw new Error("Failed to start Supabase as admin");

    const { id } = await request.json();

    // Step 1: Retrieve the offer from Supabase to get Stripe IDs
    const { data: offer, error: offerError } = await supabaseAdmin
      .from("offers")
      .select("stripe_product_id, stripe_price_id")
      .eq("id", id)
      .single();

    if (offerError) throw offerError;
    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found", message: "failed" },
        { status: 404 },
      );
    }

    // Step 2: Archive the Stripe price (cannot delete directly)
    if (offer.stripe_price_id) {
      await stripe.prices.update(offer.stripe_price_id, { active: false });
    }

    // Step 3: Archive the Stripe product.  (cannot delete directly)
    if (offer.stripe_product_id) {
      await stripe.products.update(offer.stripe_product_id, { active: false });
    }


    // Step 4: Delete the offer from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from("offers")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ error: null, message: "success" }, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, message: "failed" },
      { status: 500 },
    );
  }
}
export const runtime = "edge"
