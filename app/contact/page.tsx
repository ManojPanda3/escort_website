import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Contact Us | All-Nighter",
  description:
    "Get in touch with All-Nighter for support, inquiries, or feedback.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="mb-4">
            Have a question, concern, or feedback? We're here to help. Fill out
            the form below, and our team will get back to you as soon as
            possible.
          </p>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your email" />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Subject of your message" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message" rows={5} />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-2">
            <strong>Email:</strong> support@all-nighter.com
          </p>
          <p className="mb-2">
            <strong>Phone:</strong> +1 (555) 123-4567
          </p>
          <p className="mb-4">
            <strong>Hours:</strong> 24/7 Support
          </p>

          <h3 className="text-xl font-semibold mb-2">Office Address</h3>
          <p>
            All-Nighter Headquarters
            <br />
            123 Nightlife Street
            <br />
            Suite 456
            <br />
            Metropolis, NY 10001
            <br />
            United States
          </p>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Twitter
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Facebook
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
