import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, Twitter } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pasteId: string;
  title: string;
}
export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  pasteId,
  title,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/paste/${pasteId}`);
    }
  }, [pasteId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast("The paste link has been copied to your clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast("Failed to copy the link. Please copy it manually.");
      console.error("Failed to copy text: ", err);
    }
  };

  const shareOnTwitter = () => {
    const tweetText = `Check out this code snippet: ${title}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Paste</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-url">Share Link</Label>
            <div className="flex space-x-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Share on Social Media</Label>
            <div className="flex space-x-2">
              <Button
                onClick={shareOnTwitter}
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
                disabled={!shareUrl}
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
