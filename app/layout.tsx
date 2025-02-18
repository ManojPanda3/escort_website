import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import AgeVerification from "../components/age-verification.tsx";
import { LoadingSpinner } from "@/components/ui/loading";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background dark:bg-black text-foreground dark:text-white flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <AgeVerification />
          <NavBar />
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
