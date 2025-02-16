// --- NEW FILE: app/profile/bookmarks-dialog.tsx ---
"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { useEffect, useState } from "react";

type BookmarkType = Database["public"]["Tables"]["bookmarks"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];
interface BookmarksDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  bookmarks: BookmarkType[];
}

export function BookmarksDialog(
  { open, setOpen, bookmarks }: BookmarksDialogProps,
) {
  const [bookmarkedUsers, setBookmarkedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchBookmarkedUsers = async () => {
      if (bookmarks.length === 0) {
        setBookmarkedUsers([]);
        return;
      }

      setIsLoading(true);
      try {
        const userIds = bookmarks.map((bookmark) => bookmark.to);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .in("id", userIds);

        if (error) {
          throw error;
        }
        setBookmarkedUsers(data || []);
      } catch (err) {
        console.error("Error fetching bookmarked users:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (open && bookmarks) {
      fetchBookmarkedUsers();
    }
  }, [bookmarks, supabase, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bookmarks</DialogTitle>
          <DialogDescription>
            Here are the users you've bookmarked.
          </DialogDescription>
        </DialogHeader>
        {isLoading
          ? <p>Loading...</p>
          : bookmarkedUsers.length === 0
          ? <p>You haven't bookmarked anyone yet.</p>
          : (
            <div className="space-y-4">
              {bookmarkedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <Link
                    href={`/profile/${user.id}`}
                    className="flex items-center gap-4"
                    onClick={() => setOpen(false)}
                  >
                    <div className="relative h-10 w-10">
                      <Image
                        src={user.profile_picture || "/placeholder-image.jpg"} // Provide a placeholder
                        alt={user.name || "User"}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <span className="font-medium">
                      {user.name || user.username || "User"}
                    </span>
                  </Link>
                  {/* Add more user details here as needed */}
                </div>
              ))}
            </div>
          )}
        <DialogClose asChild>
          <Button type="button" variant={"secondary"}>Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
