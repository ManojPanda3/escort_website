"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { CategoryTabs } from "./category-tabs.tsx";
import { Database } from "@/lib/database.types";
import { EscortCard } from "./escort-card.tsx";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LoadingSpinner } from "./ui/loading";

const categories_default = [
  "All",
  "New",
  "VIP",
  "Verified",
  "Available Now",
] as const;

type Users = Database["public"]["Tables"]["users"]["Row"];
type UserType = Database["public"]["Enums"]["user type"];
type Categories = Database["public"]["Enums"]["escort_category"];

interface UsersCardProps {
  users: Users[];
  onScroll?: () => void; // Optional onScroll prop
}

interface UserWrapperProps {
  users: Users[];
  userType?: UserType | null;
  location?: string | null;
  gender?: string | null;
  searchQuery?: string | null;
  categories?: Categories[];
}

export const UserWrapper = ({
  users,
  userType,
  location,
  gender,
  searchQuery,
  categories,
}: UserWrapperProps) => {
  const supabase = createClientComponentClient();
  const [usersData, setUsersData] = useState<Users[]>(users);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const onScroll = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      let query = supabase.from("users").select("*");

      if (
        userType != null &&
        userType.trim() !== "" &&
        userType.toLocaleLowerCase() !== "all"
      ) {
        query = query.eq("user_type", userType);
      }
      if (
        location &&
        location.trim() !== "" &&
        location.toLocaleLowerCase() !== "all locations"
      ) {
        query = query.eq("location_name", location);
      }
      if (
        gender &&
        gender.trim() !== "" &&
        gender.toLocaleLowerCase() !== "viewall"
      ) {
        query = query.eq("gender", gender);
      }

      if (
        searchQuery &&
        searchQuery.trim() !== ""
      ) {
        query = query
          .ilike("username", `%${searchQuery}%`)
      }

      if (categories && categories.length !== 0) {
        query = query.contains("categories", categories);
      }

      const existingIds = usersData.map((e) => e.id);
      query = query.not("id", "in", `(${existingIds.join(',')})`);
      query = query
        .order("ratings", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(20);

      const { data: escorts, error } = await query;

      if (error) {
        console.error("Error while fetching users\n Error:", error);
      } else if (escorts) {
        if (escorts.length === 0) {
          setHasMore(false);
        } else {
          setUsersData((prevUsers) => [...prevUsers, ...escorts]);
        }
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, userType, location, gender, usersData, supabase]);

  return (
    <>
      <UsersCard users={usersData} onScroll={onScroll} />
      {
        loadingMore && (
          <LoadingSpinner />
        )
      }
    </>
  );
};

const UsersCard = ({ users, onScroll }: UsersCardProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories_default[0],
  );
  const [selectedUsers, setSelectedUsers] = useState<Users[]>(users || []);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container

  useEffect(() => {
    const filtered_user: Users[] = users?.filter((e) => {
      switch (selectedCategory) {
        case categories_default[0]:
          return true;
        case categories_default[1]:
          return isWithinLastMonth(e.created_at || new Date().toISOString());
        case categories_default[2]:
          return e.current_offer !== null;
        case categories_default[3]:
          return e.is_verified;
        case categories_default[4]:
          return e.availability;
        default:
          console.error(
            "Unknown Category selected , may be the category was not registered",
          );
          return false;
      }
    });
    setSelectedUsers(filtered_user);
  }, [selectedCategory, users]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !onScroll) {
      return;
    }

    const container = containerRef.current;
    const containerBottom = container.getBoundingClientRect().bottom;
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const scrollBottom = scrollY + windowHeight;

    const threshold = windowHeight * 0.1;

    if (containerBottom - scrollBottom <= threshold) {
      onScroll();
    }
  }, [onScroll]);



  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  if (!users || users.length === 0) {
    return;
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
        {/* Remove overflow-auto and maxHeight */}
        <div
          ref={containerRef}
          className="grid justify-evenly gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {selectedUsers?.map((user) => (
            <Link key={user.id} href={`/profile/${user.id}`} prefetch={false}>
              <EscortCard
                key={user.id}
                name={user.name || user.username}
                age={user.age}
                image={user.profile_picture}
                location={user.location_name}
                measurements={user.dress_size}
                isVerified={user.is_verified}
                isVip={user.is_vip}
                availability={user.availability}
                availability_exp={user.availability_exp}
              />
            </Link>
          ))}
          {selectedUsers.length === 0 && (
            <div className="text-center col-span-full">
              No users found for this category.
            </div>
          )}
        </div>
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
      return false;
    }

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const pastDateMonth = pastDate.getMonth();
    const pastDateYear = pastDate.getFullYear();

    if (currentYear === pastDateYear) {
      return (
        currentMonth === pastDateMonth || currentMonth - 1 === pastDateMonth
      );
    } else if (currentYear - 1 === pastDateYear && currentMonth === 0) {
      return pastDateMonth === 11;
    }
    return false;
  } catch (error) {
    console.error("Error in isWithinLastMonth:", error);
    return false;
  }
}

export default UsersCard;
