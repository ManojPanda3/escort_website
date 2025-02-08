import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Advertising Opportunities | All-Nighter",
  description:
    "Explore advertising opportunities on All-Nighter, the premium escort service platform.",
};

export default function AdvertisingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Advertising on All-Nighter</h1>
      <div className="prose max-w-none">
        <p>
          Reach a targeted audience of high-end clients and service providers
          through advertising on All-Nighter. Our platform offers various
          advertising options to suit your needs and budget.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">
          Why Advertise with Us?
        </h2>
        <ul className="list-disc pl-6">
          <li>Access to a premium, niche audience</li>
          <li>High engagement rates</li>
          <li>Flexible advertising options</li>
          <li>Targeted geographic and demographic reach</li>
          <li>Performance tracking and analytics</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">
          Advertising Options
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Banner Ads</h3>
            <p>Prominent placement on high-traffic pages</p>
            <p className="font-bold mt-2">Starting from $500/month</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Featured Listings</h3>
            <p>Boost visibility for escort profiles or agencies</p>
            <p className="font-bold mt-2">Starting from $300/month</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Sponsored Content</h3>
            <p>Native advertising in our blog and newsletter</p>
            <p className="font-bold mt-2">Starting from $750/post</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Email Campaigns</h3>
            <p>Reach our subscriber base directly</p>
            <p className="font-bold mt-2">Starting from $1000/campaign</p>
          </div>
        </div>

        <p className="mt-6">
          Our advertising team will work closely with you to create a customized
          advertising strategy that aligns with your goals and budget. Contact
          us today to discuss how we can help you reach your target audience.
        </p>

        <div className="mt-8 text-center">
          <Button size="lg">Contact Our Advertising Team</Button>
        </div>
      </div>
    </div>
  );
}
