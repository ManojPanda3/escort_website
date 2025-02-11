import { supabaseAdmin } from "@/lib/supabase";
import { unstable_cache } from "next/cache";
import AdminPages from "./tabs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import checkAdmin from "@/lib/checkAdmin";

// Cache key and duration
const CACHE_KEY = "admin-page-data";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const getData = unstable_cache(
  async (date) => {
    const [
      transactionsResponse,
      usersResponse,
      ageProofResponse,
      offersResponse,
      locationsResponse,
    ] = await Promise.all([
      supabaseAdmin
        .from("transactions")
        .select("created_at, price")
        .gte("created_at", date),
      supabaseAdmin
        .from("users")
        .select("created_at")
        .gte("created_at", date),
      supabaseAdmin
        .from("age_proof")
        .select("*")
        .eq("isverified", false),
      supabaseAdmin
        .from("offers")
        .select("*"),
      supabaseAdmin
        .from("locations")
        .select("*"),
    ]);

    return {
      transactions: transactionsResponse.data || [],
      transactionError: transactionsResponse.error,
      users: usersResponse.data || [],
      usersError: usersResponse.error,
      ageProof: ageProofResponse.data || [],
      ageProofError: ageProofResponse.error,
      offers: offersResponse.data || [],
      offersError: offersResponse.error,
      locations: locationsResponse.data || [],
      locationsError: locationsResponse.error,
    };
  },
  [],
  { revalidate: CACHE_DURATION },
);

export default async function AdminPage() {
  if (!await checkAdmin()) {
    // Redirect or show an error (uncomment router.push to redirect)
    return <div>Access Denied</div>;
  }

  // Generate last 12 months
  const months = Array.from(
    { length: 12 },
    (_, i) =>
      new Date(new Date().setMonth(new Date().getMonth() - i)).toLocaleString(
        "default",
        { month: "short" },
      ),
  ).reverse();

  // Date 1 year ago
  const date = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    .toISOString();

  // Fetch data from cache or database
  const {
    transactions,
    transactionError,
    users,
    usersError,
    ageProof,
    ageProofError,
    offers,
    offersError,
    locations,
    locationsError,
  } = await getData(date);

  // Handle errors
  if (
    transactionError || usersError || ageProofError || offersError ||
    locationsError
  ) {
    console.error("Error fetching data:", {
      transactionError,
      usersError,
      ageProofError,
      offersError,
      locationsError,
    });
    return <div>Error loading data</div>;
  }

  // Initialize variables
  let transactionVolume = {};
  let userStats = {};
  const totalTransactions = transactions.length;
  const totalEarnings = transactions.reduce((sum, item) => {
    if (!item?.created_at || isNaN(parseFloat(item?.price))) return sum;
    const month = new Date(item.created_at).toLocaleString("default", {
      month: "short",
    });
    transactionVolume[month] = (transactionVolume[month] || 0) + 1;
    return sum + parseFloat(item.price);
  }, 0);

  const totalUsers = users.length;
  users.forEach((user) => {
    if (!user?.created_at) return;
    const month = new Date(user.created_at).toLocaleString("default", {
      month: "short",
    });
    userStats[month] = (userStats[month] || 0) + 1;
  });

  // Prepare data for charts
  const transactionStats = months.map((month) => ({
    name: month,
    transactions: transactionVolume[month] || 0,
  }));

  const userStatsData = months.map((month) => ({
    name: month,
    users: userStats[month] || 0,
  }));

  return (
    <AdminPages
      userStats={userStatsData}
      transactionStats={transactionStats}
      totalUsers={totalUsers}
      totalTransactions={totalTransactions}
      totalEarnings={totalEarnings}
      ageProof={ageProof}
      offers={offers}
      locations={locations}
    />
  );
}
