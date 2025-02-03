"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, easeIn, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";

interface FeaturedEscortProps {
  username: string;
  profile_picture: string;
  age: number;
  location_name: string;
  price: string;
  rank: "week" | "day" | "month";
}

const rankColors = {
  week: "from-blue-400 to-purple-500",
  day: "from-pink-400 to-red-500",
  month: "from-amber-400 to-orange-500",
};

const rankEmojis = {
  week: "🌟",
  day: "🌞",
  month: "👑",
};

function FeaturedEscort(
  { username, profile_picture, age, location_name, price, rank }:
    FeaturedEscortProps,
) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-full h-[500px] rounded-xl overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-[1.02]"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.09 }}
      transition={{ duration: 0.25, type: easeIn }}
    >
      <Card className="w-full h-full bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={profile_picture || "/placeholder.svg"}
            alt={`Profile of ${username}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${
              rankColors[rank]
            } opacity-50`}
          >
          </div>
          <div className="absolute inset-0 border-4 border-gold rounded-xl pointer-events-none">
          </div>

          <AnimatePresence>
            {isHovered
              ? (
                <motion.div
                  className="absolute inset-0 flex flex-col justify-between bg-black/80 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h3 className="text-3xl font-bold mb-2 text-white">
                      {username}
                    </h3>
                    <p className="text-lg text-amber-300">{location_name}</p>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      <span className="font-semibold">Age:</span> {age}
                    </p>
                    <p>
                      <span className="font-semibold">Dress Size:</span>{" "}
                      {/* {dress_size || ""} */}
                    </p>
                    <p>
                      <span className="font-semibold">Hair Color:</span>{" "}
                      {/* {hair_color || ""} */}
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span> {price}
                    </p>
                    <p>
                      <span className="font-semibold">Service:</span>{" "}
                      {/* {service_type || ""} */}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full bg-gradient-to-r ${
                      rankColors[rank]
                    } text-white font-bold flex items-center justify-center`}
                  >
                    <Star className="w-5 h-5 mr-2" />
                    <span>
                      Escort of the{" "}
                      {rank.charAt(0).toUpperCase() + rank.slice(1)}
                    </span>
                  </div>
                </motion.div>
              )
              : (
                <motion.div
                  className="absolute inset-0 flex flex-col justify-end p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-3xl font-bold mb-2 text-white">
                    {username}
                  </h3>
                  <div className="flex items-center gap-2 text-amber-300">
                    <span>{age} years</span>
                    <span aria-hidden="true">•</span>
                    <span>{price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 mt-2">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <span>{location_name}</span>
                  </div>
                  <button
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold py-2 rounded-full shadow-md transition-colors duration-300 hover:from-amber-600 hover:to-yellow-600 mt-4"
                    aria-label={`View ${username}'s profile`}
                  >
                    View Profile
                  </button>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}

export function FeaturedEscorts({ users }: { users: FeaturedEscortProps[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextEscort = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
  };

  const prevEscort = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + users.length) % users.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextEscort();
    }, 5000);

    return () => clearInterval(interval);
  }, [users.length]);

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent font-playfair-display">
        High Ranked Escorts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((escort, index) => (
          <motion.div
            key={escort.username}
            className="transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FeaturedEscort
              profile_picture={escort.profile_picture || "/placeholder.svg"}
              location_name={escort.location_name}
              username={escort.username}
              age={escort.age}
              price={escort.price}
              rank={index === 0 ? "week" : index === 1 ? "day" : "month"}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

