import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Etiquette Guide | All-Nighter - Conduct & Expectations",
  description:
    "Navigate All-Nighter with grace. Understand proper conduct, expectations, and guidelines for a respectful and enjoyable experience.",
};

export default function EtiquettePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto bg-stone-50 dark:bg-stone-900 shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-amber-700 dark:text-amber-500 font-serif">
            All-Nighter Etiquette Guide
          </CardTitle>
          <CardDescription className="text-stone-500 dark:text-stone-400">
            Fostering a respectful and professional community for all members.
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none prose-lg dark:prose-invert px-6 py-8">
          <p>
            At All-Nighter, we prioritize mutual respect and professional
            conduct. These guidelines ensure a positive experience for every
            member of our community.
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mb-4">
              For Esteemed Clients
            </h2>
            <ul className="list-decimal pl-6">
              <li>
                <b>Respectful Communication:</b>{" "}
                Always be courteous and considerate in all interactions.
              </li>
              <li>
                <b>Honoring Agreements:</b>{" "}
                Adhere to agreed-upon terms of service and rates.
              </li>
              <li>
                <b>Respecting Boundaries:</b>{" "}
                Always respect the escort's personal boundaries and consent.
              </li>
              <li>
                <b>Personal Grooming:</b>{" "}
                Maintain appropriate hygiene and grooming standards.
              </li>
              <li>
                <b>Punctuality:</b> Arrive promptly for scheduled appointments.
              </li>
              <li>
                <b>Accurate Information:</b>{" "}
                Provide truthful and complete details when making bookings.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mb-4">
              For Our Valued Escorts
            </h2>
            <ul className="list-decimal pl-6">
              <li>
                <b>Professional Demeanor:</b>{" "}
                Maintain a high level of professionalism at all times.
              </li>
              <li>
                <b>Honest Representation:</b>{" "}
                Accurately describe your services and rates.
              </li>
              <li>
                <b>Client Confidentiality:</b>{" "}
                Respect client privacy and maintain strict confidentiality.
              </li>
              <li>
                <b>Timely Arrival:</b>{" "}
                Arrive on time and prepared for all appointments.
              </li>
              <li>
                <b>Hygiene Standards:</b> Maintain exceptional personal hygiene.
              </li>
              <li>
                <b>Clear Communication:</b>{" "}
                Clearly communicate your boundaries, services, and expectations.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mb-4">
              General Conduct Guidelines
            </h2>
            <ul className="list-decimal pl-6">
              <li>
                <b>Prohibition of Illegal Activities:</b>{" "}
                Any illegal actions are strictly prohibited.
              </li>
              <li>
                <b>Privacy of Members:</b>{" "}
                Respect the privacy and anonymity of all users.
              </li>
              <li>
                <b>Reporting Inappropriate Behavior:</b>{" "}
                Report any suspicious or unacceptable behavior to our support
                team.
              </li>
              <li>
                <b>No Personal Contact Information Sharing:</b>{" "}
                Refrain from sharing personal contact details through the
                platform.
              </li>
              <li>
                <b>Compliance with Local Laws:</b>{" "}
                Adhere to all local laws and regulations.
              </li>
            </ul>
          </section>

          <p className="mt-8">
            By embracing these guidelines, you contribute to a secure and
            enjoyable environment for every member of All-Nighter. Remember,
            mutual respect is the bedrock of positive and lasting interactions
            within our community.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

