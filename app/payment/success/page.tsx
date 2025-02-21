import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

function OnerrorComponent({ error }: { error: string }) {
  return (
    <div className="flex justify-center items-center">
      <p>{error}</p>
    </div>
  );
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  const session_id = (await searchParams).session_id;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }
  const userId = session.user.id;

  try {
    // 1. Retrieve the Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    // 2. Check the payment_status
    if (stripeSession.payment_status !== "paid") {
      console.error(
        "Stripe payment status is not 'paid':",
        stripeSession.payment_status,
      );
      return (
        <OnerrorComponent
          error={`Payment not successful. Status: ${stripeSession.payment_status}`}
        />
      );
    }

    // 3. Retrieve transaction from Supabase
    const { data: transaction, error: transaction_error } = await supabase
      .from("transactions")
      .select("*")
      .eq("session_id", session_id)
      .single();

    if (transaction_error) {
      console.error("Error fetching transaction:", transaction_error);
      return <OnerrorComponent error="Unable to find transaction status" />;
    }

    if (transaction.status !== "pending") {
      console.warn("Transaction already resolved:", transaction.status);
      return (
        <OnerrorComponent error="Error: The transaction is already resolved" />
      );
    }

    // 3.5. Retrieve Offer details
    const { data: offer, error: offerError } = await supabaseAdmin
      .from("offers")
      .select("isvip_included")
      .eq("id", transaction.offer_id)
      .single();

    if (offerError) {
      console.error("Error fetching offer details:", offerError);
      return <OnerrorComponent error="Unable to fetch offer details" />;
    }

    if (!offer) {
      console.error("Offer not found for ID:", transaction.offer_id);
      return <OnerrorComponent error="Offer details not found" />;
    }

    // 3.7. Retrieve current user data (NEW)
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("is_vip")
      .eq("id", transaction.owner)
      .single();

    if (userError) {
      console.error("Error fetching current user data:", userError);
      return <OnerrorComponent error="Unable to fetch user details" />;
    }

    if (!currentUser) {
      console.error("User not found for ID:", transaction.owner);
      return <OnerrorComponent error="User details not found" />;
    }


    // 4. Update the database ONLY if Stripe confirms success
    const update_transaction = supabase
      .from("transactions")
      .update({
        status: "success",
      })
      .eq("session_id", session_id); // Ensure you're updating the correct transaction

    // Update user, including is_vip based on the offer (MODIFIED)
    const update_user = supabaseAdmin
      .from("users")
      .update({
        current_offer: transaction.offer_id,
        is_vip: currentUser.is_vip || offer.isvip_included === true, // OR logic
      })
      .eq("id", transaction.owner); // Match user ID to the 'owner' in transactions


    const [
      { error: update_transaction_error },
      { error: update_user_error },
    ] = await Promise.all([
      update_transaction,
      update_user,
    ]);

    if (update_transaction_error) {
      console.error("Error updating transaction:", update_transaction_error);
      return (
        <OnerrorComponent
          error={`Error updating transaction: ${update_transaction_error.message}`}
        />
      );
    }

    if (update_user_error) {
      console.error("Error updating user:", update_user_error);
      return (
        <OnerrorComponent
          error={`Error updating user: ${update_user_error.message}`}
        />
      );
    }

    // 5. Render the success page
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your subscription has been activated.
          </p>
          <div className="pt-4">
            <Link href="/profile">
              <Button className="w-full">Go to Profile</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  } catch (error: any) {
    console.error("Error verifying Stripe session:", error);
    return (
      <OnerrorComponent error={`Error verifying payment: ${error.message}`} />
    );
  }
}
