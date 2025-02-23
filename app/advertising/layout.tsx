
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Advertising Opportunities | All-Nighter",
  description:
    "Explore advertising opportunities on All-Nighter, the premium escort service platform.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
}
