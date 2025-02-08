import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | All-Nighter",
  description:
    "Learn more about All-Nighter, your premium escort service platform.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About All-Nighter</h1>
      <div className="prose max-w-none">
        <p>
          Welcome to All-Nighter, your trusted platform for premium escort
          services.
        </p>
        <p>
          At All-Nighter, we are committed to providing a safe, discreet, and
          high-quality experience for both our clients and service providers.
          Our platform connects discerning clients with professional, verified
          escorts who offer companionship and entertainment services.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
        <p>
          Our mission is to revolutionize the escort industry by offering a
          transparent, secure, and user-friendly platform. We strive to create a
          space where mutual respect, consent, and professionalism are
          paramount.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">What Sets Us Apart</h2>
        <ul className="list-disc pl-6">
          <li>Rigorous verification process for all service providers</li>
          <li>User-friendly interface for easy browsing and booking</li>
          <li>Commitment to privacy and discretion</li>
          <li>24/7 customer support</li>
          <li>
            Wide range of services and providers to suit diverse preferences
          </li>
        </ul>
        <p className="mt-6">
          Whether you're seeking companionship for a night out, a travel
          partner, or a memorable experience, All-Nighter is here to cater to
          your needs. We invite you to explore our platform and discover the
          All-Nighter difference.
        </p>
      </div>
    </div>
  );
}
