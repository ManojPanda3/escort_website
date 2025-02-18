import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabase.ts";
import { NextRequest, NextResponse } from "next/server.js";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerComponentClient({ cookies });
    const { data: { user: user } } = await supabase.auth.getUser();
    console.log(user);
    const { offer_id, priceId }: {
      offer_id: string;
      priceId: string;
    } = await req.json();

    // Create a Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: "unable to use db as admin",
        },
        {
          status: 500,
        },
      );
    }

    if (!baseUrl) {
      console.error("NEXT_PUBLIC_DOMAIN is not defined in the environment.");
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_DOMAIN" },
        { status: 500 },
      ); // Explicitly return a response if baseUrl is missing.
    }
    if (!user) {
      return NextResponse.json({
        error: "Unauthorize user, login required",
      }, {
        status: 401,
      });
    }

    // on failuare  `${baseUrl}/payment/failed?session_id={CHECKOUT_SESSION_ID}`,
    const stripe_payment = stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url:
        `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });
    const [session, { data: offer_details, error: offer_error }] = await Promise
      .all([
        stripe_payment,
        supabaseAdmin.from("offers").select("*").eq("id", offer_id).single(),
      ]);
    if (offer_error) {
      return NextResponse.json({
        error:
          `Error while fetching offer details,offer does't found, ${offer_error}`,
      }, {
        status: 404,
      });
    }
    if (!session.id) {
      return NextResponse.json({
        error: "error while geting session id",
      }, {
        status: 500,
      });
    }
    const { user: transaction_user, error: transaction_error } =
      await supabaseAdmin.from("transactions")
        .insert([{
          offer_id,
          owner: user.id,
          price: offer_details.price,
          username: user.user_metadata.username,
          status: "pending",
          stripe_price_id: priceId,
          session_id: session.id,
        }]);
    if (transaction_error) {
      return NextResponse.json({
        error: transaction_error,
      }, { status: 500 });
    }
    console.log(session);

    return NextResponse.json({ sessionId: session.id }); // Explicitly return the success response.
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    ); // Explicitly return the error response.
  }
}
