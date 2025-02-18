"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import getRandomImage from "@/lib/randomImage";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@/components/ui/separator";

const AboutPage = () => {
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
      className="container mx-auto px-4 py-12 text-stone-800 dark:text-stone-200"
      variants={containerVariants}
      initial="hidden"
      animate={isMounted ? "visible" : "hidden"}
    >
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-5xl font-extrabold text-center mb-8 text-amber-700 dark:text-amber-500 font-serif"
          variants={itemVariants}
        >
          A Royal Decree: About All-Nighter
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-12 items-start"
        >
          <div className="md:w-1/3 flex flex-col items-center md:items-start">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={getRandomImage()} alt="Royal Avatar" />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <p className="text-lg text-center md:text-left">
              "Committed to providing experiences fit for royalty. Discretion
              and Excellence above all."
            </p>
          </div>

          <div className="md:w-2/3 prose max-w-none prose-lg dark:prose-invert">
            <p className="lead">
              By royal decree, we welcome you to All-Nighter, an esteemed
              establishment dedicated to providing unparalleled escort services.
            </p>
            <p>
              At All-Nighter, we uphold the highest standards of discretion,
              safety, and refinement. We connect discerning clientele with
              professional, vetted companions, each offering bespoke experiences
              tailored to individual desires. Our commitment to excellence
              ensures every interaction is conducted with grace and
              sophistication.
            </p>

            <Separator className="my-8" />

            <h2 className="text-3xl font-semibold mt-6 mb-4 text-amber-600 dark:text-amber-400">
              Our Noble Mission
            </h2>
            <p>
              Our mission is to redefine the landscape of companionship,
              creating a realm of transparency, security, and unparalleled user
              experience. We are dedicated to fostering an environment of mutual
              respect, unwavering consent, and consummate professionalism.
            </p>

            <Separator className="my-8" />

            <h2 className="text-3xl font-semibold mt-6 mb-4 text-amber-600 dark:text-amber-400">
              Distinguished Hallmarks of Our Realm
            </h2>
            <ul className="list-decimal pl-6">
              <li>
                <b>Elite Vetting:</b>{" "}
                A rigorous selection process ensures only the most refined and
                reputable companions grace our platform.
              </li>
              <li>
                <b>Elegant Interface:</b>{" "}
                An intuitive and seamless platform facilitates effortless
                browsing and booking.
              </li>
              <li>
                <b>Unwavering Discretion:</b>{" "}
                Your privacy is paramount; we employ stringent measures to
                safeguard your anonymity.
              </li>
              <li>
                <b>Round-the-Clock Concierge:</b>{" "}
                Our dedicated support staff is available 24/7 to attend to your
                every need.
              </li>
              <li>
                <b>A Tapestry of Choices:</b>{" "}
                A diverse array of companions and services ensures a perfect
                match for every discerning taste.
              </li>
            </ul>

            <Separator className="my-8" />

            <p className="mt-8">
              Whether seeking sophisticated company for an evening engagement, a
              discreet travel companion, or an unforgettable experience,
              All-Nighter stands ready to fulfill your desires. We invite you to
              explore our realm and discover the All-Nighter difference – a
              commitment to luxury, discretion, and unparalleled service.
            </p>
            <p>
              We offer only the most exclusive and tailored experiences fit for
              royalty.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutPage;

