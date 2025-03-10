import { notFound, redirect } from "next/navigation";
import LoginPage from "./login_page.tsx"; // Import the new login page
import SignupPage from "./signup_page.tsx"; // Import the signup page
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import UpdatePasswordPage from "./update-password_page.tsx"; // Import UpdatePasswordPage

interface AuthPageProps {
  params: { action: "login" | "signup" | "update-password" }; // Include 'update-password'
}

export default async function AuthPage(props: AuthPageProps) {
  const { action } = props.params;

  if (!["login", "signup", "update-password"].includes(action)) {
    return notFound();
  }

  const supabase = createServerComponentClient({ cookies });
  const { data: { user: isLoggedIn } } = await supabase.auth.getUser();

  if (isLoggedIn && (action === "login" || action === "signup")) {
    return redirect("/profile");
  }

  if (action === "login") {
    return <LoginPage />;
  } else if (action === "signup") {
    return <SignupPage />;
  } else if (action === "update-password") { // Handle update-password
    return <UpdatePasswordPage />;
  }
}

export const runtime = "edge"
