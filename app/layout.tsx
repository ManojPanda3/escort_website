import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import AgeVerification from "../components/age-verification.tsx";
import { LoadingSpinner } from "@/components/ui/loading";
import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken"; // Or another JWT library

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const session = await supabase.auth.getSession(); // Get the session

  let userId: string | null = null;

  if (session?.data?.session?.access_token) {
    try {
      const decodedToken: any = decode(session.data.session.access_token); // Decode the JWT
      userId = decodedToken?.sub || null; // 'sub' is often the user ID
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background dark:bg-black text-foreground dark:text-white flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <AgeVerification />
          <NavBar
            userId={userId}
          />
          <main className="flex-grow">
            <Suspense
              fallback={<LoadingSpinner />}
            >
              {children}
            </Suspense>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

