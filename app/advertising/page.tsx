"use client"
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card"; // Import Card components
import { Separator } from "@/components/ui/separator";


export default function AdvertisingPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-12 text-stone-800 dark:text-stone-200" // Consistent text colors
      variants={containerVariants}
      initial="hidden"
      animate={isMounted ? "visible" : "hidden"}
    >
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-5xl font-extrabold text-center mb-8 text-amber-700 dark:text-amber-500 font-serif" // Consistent title styling
          variants={itemVariants}
        >
          Advertising on All-Nighter
        </motion.h1>

        <motion.div variants={itemVariants} className="prose max-w-none prose-lg dark:prose-invert">
          <p>
            Reach a targeted audience of high-end clients and service providers
            through advertising on All-Nighter. Our platform offers various
            advertising options to suit your needs and budget.
          </p>

          <Separator className="my-8" />

          <h2 className="text-3xl font-semibold mt-6 mb-4 text-amber-600 dark:text-amber-400"> {/* Consistent heading styling */}
            Why Advertise with Us?
          </h2>
          <ul className="list-disc pl-6">
            <li>Access to a premium, niche audience</li>
            <li>High engagement rates</li>
            <li>Flexible advertising options</li>
            <li>Targeted geographic and demographic reach</li>
            <li>Performance tracking and analytics</li>
          </ul>

          <Separator className="my-8" />

          <h2 className="text-3xl font-semibold mt-6 mb-4 text-amber-600 dark:text-amber-400"> {/* Consistent heading styling */}
            Advertising Options
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {/* Use Card and CardContent for consistent styling */}
            <Card className="bg-stone-50 dark:bg-stone-900 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Banner Ads</h3>
                <p>Prominent placement on high-traffic pages</p>
                <p className="font-bold mt-2">Starting from $500/month</p>
              </CardContent>
            </Card>
            <Card className="bg-stone-50 dark:bg-stone-900 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Featured Listings</h3>
                <p>Boost visibility for escort profiles or agencies</p>
                <p className="font-bold mt-2">Starting from $300/month</p>
              </CardContent>
            </Card>
            <Card className="bg-stone-50 dark:bg-stone-900 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sponsored Content</h3>
                <p>Native advertising in our blog and newsletter</p>
                <p className="font-bold mt-2">Starting from $750/post</p>
              </CardContent>
            </Card>
            <Card className="bg-stone-50 dark:bg-stone-900 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Email Campaigns</h3>
                <p>Reach our subscriber base directly</p>
                <p className="font-bold mt-2">Starting from $1000/campaign</p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          <p className="mt-6">
            Our advertising team will work closely with you to create a customized
            advertising strategy that aligns with your goals and budget. Contact
            us today to discuss how we can help you reach your target audience.
          </p>

          <div className="mt-8 text-center">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white"> {/* Consistent button styling */}
              Contact Our Advertising Team
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
export const runtime = "edge"
