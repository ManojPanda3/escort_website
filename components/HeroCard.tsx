"use client";

import getRandomImage from "@/lib/randomImage";
import { motion } from "framer-motion";
import FilterSelect from "./FilterSelect";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import locations from "@/public/location.json";

const genderOptions = ["ViewAll", "Female", "Male", "Other"];
const locationOptions = ["All Locations", ...locations];
const HeroCard = (
  {
    label,
    initial_location = locationOptions[0],
    initial_gender = genderOptions[0],
  }: {
    label: string;
    initial_location: string;
  },
) => {
  const [location, setLocation] = useState(initial_location);
  const [gender, setGender] = useState(initial_gender);
  const router = useRouter(); // Initialize useRouter

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const handleSearch = () => {
    let locationParam = location === "All Locations" ? null : location;
    let genderParam = gender === "ViewAll" ? null : gender;

    const params = new URLSearchParams();
    if (locationParam) params.append("location", locationParam);
    if (genderParam) params.append("gender", genderParam);

    router.push(`/escorts?${params.toString()}`);
  };

  return (
    <motion.div
      className="relative rounded-md overflow-hidden shadow-lg text-stone-800 dark:text-stone-200"
      style={{
        backgroundImage: `url(/royal.jpeg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "400px",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative p-6 flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-amber-500 dark:text-amber-400">
          {label}
        </h2>
        <p className="text-center mb-4">
          Your trusted destination for refined companionship.
        </p>

        <div className="w-full mt-6 flex flex-col sm:flex-row gap-4">
          <FilterSelect
            label="Location"
            options={locationOptions}
            value={location}
            setValue={setLocation}
          />
          <FilterSelect
            label="Gender"
            options={genderOptions}
            value={gender}
            setValue={setGender}
          />
        </div>

        <button
          className="mt-6 bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-8 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </motion.div>
  );
};

export default HeroCard;
