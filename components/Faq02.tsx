"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.15, ease: "easeOut" }}
      className={cn(
        "group rounded-lg border border-gray-200 dark:border-gray-800",
        "transition-all duration-200 ease-in-out",
        isOpen
          ? "bg-gray-50 dark:bg-gray-900"
          : "hover:bg-gray-100 dark:hover:bg-gray-800",
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between"
      >
        <h3
          className={cn(
            "text-base font-medium",
            isOpen
              ? "text-gray-900 dark:text-white"
              : "text-gray-700 dark:text-gray-300",
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-gray-500 dark:text-gray-400"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="px-6 pb-4 pt-2">
              <motion.p
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FaqAllNighters() {
  const faqs: Omit<FAQItemProps, "index">[] = [
    {
      question: "What is All Nighters?",
      answer:
        "All Nighters is a premium platform where you can discover elite companionship services, curated to ensure discretion, authenticity, and high-class experiences.",
    },
    {
      question: "How do I book a service?",
      answer:
        "Simply browse through profiles, select your desired companion, and use the provided contact details to arrange your appointment directly.",
    },
    {
      question: "Is my privacy protected?",
      answer:
        "Absolutely. We prioritize privacy and security, ensuring all interactions remain confidential and secure.",
    },
    {
      question: "How do I become a listed escort on All Nighters?",
      answer:
        "If you’re interested in joining our platform, you can apply through our sign-up portal, providing necessary details for verification.",
    },
  ];

  return (
    <section className="py-16 w-full bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Find answers to the most common questions about All Nighters
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md mx-auto mt-12 p-6 text-center"
        >
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-gray-200 dark:bg-gray-800 mb-4">
            <Mail className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Still have questions?
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Our support team is available to help.
          </p>
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default FaqAllNighters;
