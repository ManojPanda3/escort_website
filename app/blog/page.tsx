import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Blog | All-Nighter",
  description:
    "Stay updated with the latest news, tips, and insights from All-Nighter.",
};

// This would typically come from a CMS or API
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Date Ideas for a Memorable Night",
    excerpt:
      "Discover unique and exciting date ideas to make your evening unforgettable...",
    date: "2023-06-15",
    author: "Emma Nightingale",
    category: "Dating Tips",
  },
  {
    id: 2,
    title: "Staying Safe: Essential Tips for Clients and Escorts",
    excerpt:
      "Learn about the best practices to ensure a safe and enjoyable experience for all parties...",
    date: "2023-06-10",
    author: "Alex Safety",
    category: "Safety",
  },
  {
    id: 3,
    title: "The Evolution of the Escort Industry in the Digital Age",
    excerpt:
      "Explore how technology has transformed the landscape of escort services...",
    date: "2023-06-05",
    author: "Dr. Tech Savvy",
    category: "Industry Insights",
  },
  {
    id: 4,
    title: "Self-Care Rituals for Busy Escorts",
    excerpt:
      "Discover effective self-care strategies to maintain your well-being in a demanding profession...",
    date: "2023-05-30",
    author: "Wellness Guru",
    category: "Health & Wellness",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Blog</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>{post.date}</span>
              <span>{post.author}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {post.category}
              </span>
              <Link href={`/blog/${post.id}`} passHref>
                <Button variant="outline">Read More</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button size="lg">Load More Posts</Button>
      </div>
    </div>
  );
}
export const runtime = "edge"
