// app/payment/failed/page.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

function OnerrorComponent({ error }) {
  return (
    <div className="flex justify-center items-center">
      <p>{error}</p>
    </div>
  );
}

export default async function PaymentFailedPage(
  {
    searchParams,
  }: {
    searchParams: { session_id: string };
  },
) {
  const supabase = createServerComponentClient({ cookies });
  const session_id = (await searchParams).session_id;
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    if (stripeSession.payment_status === "paid") {
      return (
        <OnerrorComponent error="Payment unexpectedly succeeded. Please contact support." />
      );
    }

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

    // Update the transaction status to "failed"
    const { error: updateError } = await supabase
      .from("transactions")
      .update({ status: "failed" })
      .eq("session_id", session_id);

    if (updateError) {
      console.error("Error updating transaction status:", updateError);
      return <OnerrorComponent error="Error updating transaction status" />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold">Payment Failed</h1>
          <p className="text-muted-foreground">
            Your payment failed. Please try again or contact support.
          </p>
          <div className="pt-4">
            <Link href="/premium">
              <Button className="w-full">Choose a Plan</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="w-full mt-2">
                Return to Profile
              </Button>
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

export const runtime = "edge"
