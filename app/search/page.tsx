import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserWrapper } from "@/components/Users";
import { Database } from "@/lib/database.types";

type UserTypes = Database["public"]["Enums"]["user type"];
type Categories = Database["public"]["Enums"]["escort_category"];

export default async function SearchPage(
  props: {
    searchParams: Promise<{ q: string; type: UserTypes, location: string, categories: Categories | Categories[], gender: string }>;
  },
) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.q?.trim() || "";
  const searchType = searchParams.type?.trim().toLowerCase() || "";
  const location = searchParams.location?.trim().toLowerCase() || "";
  let categoriesParam = searchParams.categories;
  const gender = searchParams.gender?.trim().toLowerCase() || "";

  let categoriesArray: string[] = [];
  if (categoriesParam) {
    if (typeof categoriesParam === 'string') {
      categoriesArray = [categoriesParam.trim().toLowerCase()];
    } else if (Array.isArray(categoriesParam)) {
      categoriesArray = categoriesParam.map(n => (typeof n === 'string' ? n.trim().toLowerCase() : "")); // handle potential non-string array elements
    }
  }
  const supabase = createServerComponentClient({ cookies });
  // Fixed query logic
  let query = supabase
    .from("users")
    .select("*")
  if (searchQuery && searchQuery.trim() !== "") {
    query = query
      .ilike("username", `%${searchQuery}%`)
      .order("username", { ascending: true });
  }


  if (searchType && searchType !== "all") {
    query = query.eq("user_type", searchType);
  }
  if (
    location && location.trim() !== "" &&
    location.toLocaleLowerCase() !== "all locations"
  ) {
    query = query.eq("location_name", location);
  }

  if (
    gender && gender.trim() !== "" && gender.toLocaleLowerCase() !== "viewall"
  ) {
    query = query.eq("gender", gender);
  }
  if (categoriesArray.length !== 0) {
    query = query.contains("categories", categoriesArray);
  }
  query = query.order("ratings", { ascending: false }).order("created_at", { ascending: false }).limit(20)

  const { data: searchResults, error } = await query


  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Search Results for "{searchQuery || categoriesArray || location || searchType || gender}"
        </h1>
        <UserWrapper
          users={searchResults}
          searchQuery={searchQuery}
          categories={categoriesArray}
          userType={searchType}
          location={location}
          gender={gender}
        />
        {(!searchResults || searchResults.length === 0) && (
          <p className="text-center text-white mt-8">
            No results found for "{searchQuery || categoriesArray || location || searchType || gender}"
          </p>
        )}
      </div>
    </div>
  );
}
