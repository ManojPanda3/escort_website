import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Etiquette Guide | All-Nighter",
  description:
    "Learn about the proper etiquette when using All-Nighter escort services.",
};

export default function EtiquettePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Etiquette Guide</h1>
      <div className="prose max-w-none">
        <p>
          At All-Nighter, we believe in fostering a respectful and professional
          environment for all users. Please adhere to the following etiquette
          guidelines to ensure a positive experience for everyone.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">For Clients</h2>
        <ul className="list-disc pl-6">
          <li>Always be respectful and courteous in your communications</li>
          <li>Honor the agreed-upon terms of the service</li>
          <li>Respect the escort's boundaries and consent</li>
          <li>Maintain personal hygiene and grooming</li>
          <li>Be punctual for appointments</li>
          <li>Provide accurate information when booking</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">For Escorts</h2>
        <ul className="list-disc pl-6">
          <li>Maintain a professional demeanor at all times</li>
          <li>Be honest about your services and rates</li>
          <li>Respect client privacy and confidentiality</li>
          <li>Arrive on time for appointments</li>
          <li>Maintain high standards of personal hygiene</li>
          <li>Communicate clearly about your boundaries and services</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">General Guidelines</h2>
        <ul className="list-disc pl-6">
          <li>No illegal activities are tolerated on our platform</li>
          <li>Respect the privacy and anonymity of other users</li>
          <li>
            Report any suspicious or inappropriate behavior to our support team
          </li>
          <li>
            Do not share personal contact information through the platform
          </li>
          <li>Be aware of and comply with local laws and regulations</li>
        </ul>

        <p className="mt-6">
          By following these guidelines, you contribute to a safe and enjoyable
          experience for all users of All-Nighter. Remember, mutual respect is
          the foundation of all positive interactions on our platform.
        </p>
      </div>
    </div>
  );
}
