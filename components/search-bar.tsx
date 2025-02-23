"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { LoadingSpinner } from "./ui/loading.tsx";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "../lib/supabase.ts";
import { Database } from "@/lib/database.types";
import { cache } from "react";

type User = Database["public"]["Tables"]["users"]["Row"];

interface SearchBarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
const search_Category = [
  "all",
  "general",
  "bdsm",
  "escort",
  "couple",
];

const queryDelay: number = 500; // Reduced delay for better responsiveness

// Cached function for fetching search results
const fetchSearchResultsCached = cache(
  async (query: string, type: string, suggestions: User[], setSuggestions): Promise<User[]> => {
    try {
      let supabase_query = supabase.from("users").select(
        "id,username,profile_picture",
      )
        .ilike("username", `%${query}%`);
      if (type != "all") {
        supabase_query = supabase_query.eq("user_type", type);
      }
      const existingIds = suggestions.map((user) => user.id);
      supabase_query = supabase_query
        .not("id", "in",
          `(${existingIds.join(',')})`
        )
        .limit(5);
      const { data: results, error } = await supabase_query;

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setSuggestions([...suggestions, ...results]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  },
);

export const SearchBar: React.FC<SearchBarProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState(search_Category[0]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  // Debounce the search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, queryDelay);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch search results based on debounced query
  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearchQuery.trim() !== "") {
        setLoading(true);
        try {
          await fetchSearchResultsCached(
            debouncedSearchQuery,
            searchType,
            suggestions,
            setSuggestions
          );
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setLoading(false); // Ensure loading is set to false when clearing suggestions
      }
    };

    fetchData();
  }, [debouncedSearchQuery, searchType]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`,
      );
      setLoading(true);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = useCallback((userId: string) => {
    setLoading(true); // Show loading before navigating
    setIsOpen(false)
    router.push(`/profile/${userId}`);
  }, [router]); // Include router in the dependency array

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="sm:max-w-[425px] rounded-md bg-background shadow-md p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Search</h2>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                aria-label="Search query"
              />
              <Select
                value={searchType}
                onValueChange={(value) => setSearchType(value)}
              >
                <SelectTrigger className="w-[180px]" aria-label="Search type">
                  <SelectValue placeholder="Search type" />
                </SelectTrigger>
                <SelectContent>
                  {search_Category.map((data, index) => (
                    <SelectItem value={data} key={data + index}>
                      {data.charAt(0).toUpperCase() + data.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} aria-label="Search">
                Search
              </Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {loading ? <LoadingSpinner /> : suggestions.length > 0
                ? (
                  suggestions.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => handleSuggestionClick(user.id)}
                      role="button"
                      aria-label={`Search result for ${user.username}`}
                    >
                      <Image
                        src={user.profile_picture || "/placeholder.svg?height=100&width=100"}
                        alt={`${user.username}'s avatar`}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span>{user.username}</span>
                    </motion.div>
                  ))
                )
                : !loading && <p>No results found.</p>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

