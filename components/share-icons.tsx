import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ShareIcons = ({ id }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/video/share/${id}`;
    let shareLink = "";

    switch (platform) {
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)
          }`;
        break;
      case "instagram":
        copyLink();
        toast({
          title: "Link copied!",
          description: "Share this link on Instagram.",
        });
        return;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)
          }`;
        break;
      default:
        break;
    }

    if (shareLink) {
      window.open(shareLink, "_blank");
    }
  };

  const copyLink = () => {
    const shareUrl = `${window.location.origin}/video/share/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Link copied!",
        description: "The story link has been copied to your clipboard.",
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
    >
      <div className="flex flex-wrap gap-4 justify-center items-center sm:justify-start">
        <Image
          title={"whatsapp"}
          src={"/whatsapp-logo.svg"}
          width={24}
          height={24}
          alt={"WhatsApp"}
          onClick={() => handleShare("whatsapp")}
          className="hover:opacity-80 cursor-pointer"
        />
        <Image
          title={"twitter"}
          src={"/x-logo.svg"}
          width={24}
          height={24}
          alt={"X"}
          onClick={() => handleShare("twitter")}
          className="hover:opacity-80 cursor-pointer"
        />
        <Image
          title={"instagram"}
          src={"/instagram-logo.svg"}
          width={24}
          height={24}
          alt={"Instagram"}
          onClick={() => handleShare("instagram")}
          className="hover:opacity-80 cursor-pointer"
        />
        <Image
          title={"facebook"}
          src={"/facebook-logo.svg"}
          width={24}
          height={24}
          alt={"Facebook"}
          onClick={() => handleShare("facebook")}
          className="hover:opacity-80 cursor-pointer"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap sm:col-span-3">
        <input
          type="text"
          value={`${window.location.origin}/video/share/${id}`}
          readOnly
          className="flex-grow p-2 rounded border w-full sm:w-auto max-w-full"
          title={window.location.origin}
        />
        <Button
          size="icon"
          onClick={copyLink}
          title="copy"
          className="sm:ml-2 mt-2 sm:mt-0 flex-shrink-0 "
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ShareIcons;

