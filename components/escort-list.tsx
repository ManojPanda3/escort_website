"use client";

import { useState } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import { EscortCard } from "@/components/escort-card";
import Link from "next/link";

export function EscortList({ users }: { users: any[] }) {
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleCategorySelect = (category: string) => {
    if (category === "Featured") {
      setFilteredUsers(users); // Show all by default
    } else {
      setFilteredUsers(users.filter(user => user.category === category));
    }
  };

  return (
    <div>
      {/* Category Tabs */}
      <section aria-label="Categories" className="mb-8">
        <CategoryTabs onCategorySelect={handleCategorySelect} />
      </section>

      {/* Escort Listings */}
      <section aria-label="Escort Listings">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Link key={user.id} href={`/profile/${user.id}`} prefetch={false}>
                <EscortCard
                  name={user.username}
                  age={user.age}
                  location={user.location_name}
                  measurements={user.dress_size}
                  image={user.profile_picture || "/placeholder.svg"}
                  isVerified={user.is_verified}
                />
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">No escorts found in this category.</p>
          )}
        </div>
      </section>
    </div>
  );
}
