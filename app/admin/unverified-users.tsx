"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface User {
  id: number;
  username: string;
  email: string;
  documents: string[];
}

interface UnverifiedUsersProps {
  users: User[];
}

export function UnverifiedUsers({ users: initialUsers }: UnverifiedUsersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDocuments, setCurrentDocuments] = useState<string[]>([]);
  const [currentUserDetails, setCurrentUserDetails] = useState<
    { username: string; email: string } | null
  >(null);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleVerify = async (userId: number) => {
    setIsLoading(true);
    try {
      const data = await fetch("/api/profile/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          is_verified: true,
        }),
      });

      // Update the local state to remove the user.  Note: MUST use a function for state update in this case to guarantee the proper removal
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Filter out the verified user
      setIsLoading(false);
      setIsDialogOpen(false); // Close dialog after successful verification

      console.log("User verified successfully!");
    } catch (error) {
      console.error("Verification failed:", error);
      setIsLoading(false);
      // Consider showing an error message to the user
    }
  };

  const handleDelete = async (userId: number) => {
    setIsLoading(true);
    try {
      // **IMPORTANT:  Replace with your actual API call to DELETE**
      // await fetch(`/api/users/${userId}`, { method: 'DELETE' });  // EXAMPLE API CALL

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update the local state to remove the user
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Filter out the deleted user
      setIsLoading(false);
      setIsDialogOpen(false); // Close dialog after successful deletion
    } catch (error) {
      console.error("Deletion failed:", error);
      setIsLoading(false);
      // Consider showing an error message to the user
    }
  };

  const openUserDocuments = (user: User) => {
    setCurrentDocuments(user.age_proofs || []);
    setCurrentUserDetails({ username: user.username, email: user.email });
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-2"
        />
        <Button>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-4 bg-card rounded-lg mb-4 cursor-pointer border-gray-800 border-2 hover:bg-gray-900 transition-colors ease-in-out"
              onClick={() => openUserDocuments(user)}
            >
              <div>
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent row from opening when button clicked
                    handleDelete(user.id);
                  }}
                  disabled={isLoading}
                  className="transition-transform duration-300 hover:scale-105"
                >
                  {isLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Trash2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent row from opening when button clicked
                    handleVerify(user.owner);
                  }}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 transition-colors duration-300"
                >
                  {isLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <CheckCircle className="h-4 w-4" />}
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-amber-400">
                {currentUserDetails?.username}
              </DialogTitle>
              <DialogDescription>{currentUserDetails?.email}</DialogDescription>
            </DialogHeader>

            {currentDocuments && currentDocuments.length > 0
              ? (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {currentDocuments.map((doc, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={doc}
                        alt={`Document ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )
              : <p>No documents available for this user.</p>}

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="destructive"
                onClick={() => {
                  const userIdToDelete = filteredUsers.find(
                    (u) => u.username === currentUserDetails?.username,
                  )?.id || 0;
                  handleDelete(userIdToDelete);
                }}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  "Delete"
                )}
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  const userIdToVerify = filteredUsers.find(
                    (u) => u.username === currentUserDetails?.username,
                  )?.id || 0;
                  handleVerify(userIdToVerify);
                }}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  "Verify"
                )}
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
