// components/OfferCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaymentButton from "./paymentButton";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react"; // Import the Crown icon

interface Offer {
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

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <Card className="flex flex-col relative"> {/* Added relative positioning */}
      {/* VIP Badge - Top Right Corner */}
      {offer.isvip_included && (
        <Badge
          variant="premium" // Use a custom variant (defined below)
          className="absolute top-2 right-2 rounded-full p-1.5" // Position and style
        >
          <Crown className="h-4 w-4 text-yellow-400 hover:text-yellow-700 cursor-pointer" /> {/* Crown Icon */}
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{offer.type}</CardTitle>
        <CardDescription className="text-lg">
          ${offer.price}/{offer.billing_cycle}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <ul className="list-disc list-inside mb-4 space-y-2">
          {offer.features.map((feature, index) => (
            <li key={index} className="text-gray-700">{feature}</li>
          ))}
        </ul>
        {offer.max_media !== 0 && (
          <p className="text-sm text-muted-foreground mb-2">
            Max Media: {offer.max_media}
          </p>
        )}
        {offer.max_places !== 0 && (
          <p className="text-sm text-muted-foreground mb-4">
            Max Places: {offer.max_places}
          </p>
        )}
      </CardContent>
      <CardContent>
        <PaymentButton
          stripePriceId={offer.stripe_price_id}
          offer_id={offer.id}
        />
      </CardContent>
    </Card>
  );
}
