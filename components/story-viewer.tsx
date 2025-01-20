'use client'

import { useState } from 'react'
import { X, Heart, Share, Copy, Check } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { motion, AnimatePresence } from 'framer-motion'

interface StoryViewerProps {
  id: string
  url: string
  title: string
  isVideo?: boolean
  onClose: () => void
  isMain?: boolean
}

export function StoryViewer({ id, url, title, isVideo, isMain, onClose }: StoryViewerProps) {
  const [liked, setLiked] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleLike = () => {
    setLiked(!liked)
    // Here you would typically update the like status in your backend
  }

  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/video/share/${id}`
    let shareLink = ''

    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`
        break
      case 'instagram':
        // Instagram doesn't have a direct share URL, so we'll just copy the link
        navigator.clipboard.writeText(shareUrl)
        toast({ title: "Link copied!", description: "Share this link on Instagram." })
        return
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      default:
        break
    }

    if (shareLink) {
      window.open(shareLink, '_blank')
    }
  }


  const copyLink = () => {
    const shareUrl = `${window.location.origin}/video/share/${id}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          toast({
            title: "Link copied!",
            description: "The story link has been copied to your clipboard.",
          });
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          fallbackCopyTextToClipboard(shareUrl);
        });
    } else {
      fallbackCopyTextToClipboard(shareUrl);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.position = "absolute";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "Link copied!",
          description: "The story link has been copied to your clipboard.",
        });
      } else {
        console.error("Fallback: Copying text failed");
      }
    } catch (err) {
      console.error("Fallback: Unable to copy", err);
    }

    // Clean up the textarea
    document.body.removeChild(textArea);
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden" isMain={isMain}>
        <div className="relative w-full h-[80vh]">
          {isVideo ? (
            <video src={url} className="w-full h-full object-cover" controls autoPlay loop />
          ) : (
            <Image src={url || "/placeholder.svg"} alt={title} layout="fill" objectFit="cover" />
          )}
          <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2 h-full justify-center">
            <Button variant="ghost" size="icon" onClick={handleLike}>
              <Heart className={`h-6 w-6 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </Button>
            <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Share className="h-6 w-6 text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <AnimatePresence>
                  {isShareOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="grid gap-4"
                    >
                      <div className="flex gap-2 justify-center items-center">
                        <Image title={"whatsapp"} src={"/whatsapp-logo.svg"} width={24} height={24} alt={"WhatsApp"} onClick={() => handleShare('whatsapp')} className="hover:opacity-80 cursor-pointer" />
                        <Image title={"twitter"} src={"/x-logo.svg"} width={24} height={24} alt={"X"} onClick={() => handleShare('twitter')} className="hover:opacity-80 cursor-pointer" />
                        <Image title={"instagram"} src={"/instagram-logo.svg"} width={24} height={24} alt={"Instagram"} onClick={() => handleShare('instagram')} className="hover:opacity-80 cursor-pointer" />
                        <Image title={"facebook"} src={"/facebook-logo.svg"} width={24} height={24} alt={"Facebook"} onClick={() => handleShare('facebook')} className="hover:opacity-80 cursor-pointer" />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={`${window.location.origin}/video/share/${id}`}
                          readOnly
                          className="flex-grow mr-2 p-2 rounded border"
                        />
                        <Button size="icon" onClick={copyLink} title="copy">
                          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
