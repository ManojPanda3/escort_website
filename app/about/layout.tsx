import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | All-Nighter - A Regal Escort Service",
  description:
    "Delve into the legacy of All-Nighter, your premier platform for discerning companionship and unparalleled service. Unveil our commitment to excellence.",
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
