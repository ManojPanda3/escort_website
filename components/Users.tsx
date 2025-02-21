"use client";
import { useEffect, useState } from "react";
import { CategoryTabs } from "./category-tabs.tsx";
import { Database } from "@/lib/database.types";
import { EscortCard } from "./escort-card.tsx";
import Link from "next/link";

const categories_default = [
  "All",
  "New",
  "VIP",
  "Verified",
  "Available Now",
] as const;

type Users = Database["public"]["Tables"]["users"]["Row"];
const UsersCard = ({
  users,
}: {
  users: Users[];
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories_default[0],
  );
  const [selectedUsers, setSelectedUsers] = useState<Users[]>(users || []); // Initialize as empty array

  useEffect(() => {
    // filter the escort
    const filtered_user: Users[] = users.filter((e) => {
      switch (selectedCategory) {
        case categories_default[0]:
          return true;
        case categories_default[1]:
          return isWithinLastMonth(e.created_at || (new Date()).toISOString());
        case categories_default[2]:
          return e.current_offer !== null;
        case categories_default[3]:
          return e.is_verified;
        case categories_default[4]:
          return e.availability; // Assuming availability is a boolean
        default:
          console.error(
            "Unknown Category selected , may be the category was not registered",
          );
          return false; // Default to not showing the user on unknown category
      }
    });
    // save the filtered escort
    setSelectedUsers(filtered_user);
  }, [selectedCategory, users]);


  // Render a loading state or message if users is empty or still loading
  if (!users || users.length === 0) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <>
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Browse by Category
        </h2>
        <CategoryTabs
          categories={categories_default}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </section>

      <section aria-label="Escort Listings">
        <div className="grid  gap-6 grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
          {selectedUsers.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              prefetch={false}
            >
              <EscortCard
                key={user.id}
                name={user.name || user.username}
                age={user.age}
                image={user.profile_picture}
                location={user.location_name}
                measurements={user.dress_size}
                isVerified={user.is_vip}
                isVip={user.is_vip}
                availability={user.availability}
                isOnline={user.is_available}
              />
            </Link>
          ))}
        </div>
        {selectedUsers.length === 0 && (
          <div className="text-center col-span-full">No users found for this category.</div>
        )}
      </section>
    </>
  );
};

function isWithinLastMonth(dateString: string) {
  try {
    const now = new Date();
    const pastDate = new Date(dateString);

    if (isNaN(pastDate.getTime())) {
      console.error("Invalid date string:", dateString);
      return false; // Handle invalid date strings gracefully
    }

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const pastDateMonth = pastDate.getMonth();
    const pastDateYear = pastDate.getFullYear();

    // Check if the date is within the current month or the immediately preceding month
    if (currentYear === pastDateYear) {
      return currentMonth === pastDateMonth ||
        currentMonth - 1 === pastDateMonth;
    } else if (currentYear - 1 === pastDateYear && currentMonth === 0) {
      // Case when current month is January (0) and we check for December of last year
      return pastDateMonth === 11; // 11 is December (0-indexed)
    }
    return false;
  } catch (error) {
    console.error("Error in isWithinLastMonth:", error);
    return false;
  }
}

export default UsersCard;
