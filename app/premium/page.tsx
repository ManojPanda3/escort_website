// app/premium/page.tsx  (Remains the same as previous, no changes needed)
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { OfferCard } from "@/components/offer_card"; // Import the new component
import { Suspense } from "react";


interface Offer {  // Define the Offer interface here as well
  id: string;
  type: string;
  price: number;
  billing_cycle: string;
  features: string[];
  stripe_price_id: string;
  isvip_included: boolean;
  max_media: number | null;
  max_places: number | null;
}

async function getOffers() {
  const supabase = createServerComponentClient({ cookies });
  const { data: offers, error } = await supabase
    .from("offers")
    .select("*")
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching offers:", error);
    return []; // Return an empty array on error
  }

  return offers as Offer[]; // Type assertion

}
async function OfferList() {
  const offers = await getOffers();
  return (
    <>
      {offers.length === 0 ? (
        <p>No premium plans available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </>
  )
}


export default async function PremiumPage() {


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Premium Plans</h1>
      <Suspense fallback={<p>Loading Offers...</p>}>
        <OfferList />
      </Suspense>

    </div>
  );
}
