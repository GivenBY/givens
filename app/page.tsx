"use client";
import { LanguageSelector } from "@/components/editor/LanguageSelector";
import { MonacoWrapper } from "@/components/editor/MonacoWrapper";
import { ShareModal } from "@/components/modals/ShareModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@clerk/nextjs";
import { Copy, Eye, EyeOff, Save, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export default function Home() {
  const [language, setLanguage] = useState("javascript");
  const [isPublic, setIsPublic] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [savedPasteId, setSavedPasteId] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const handleCopy = () => {
    navigator.clipboard.writeText("Your code snippet here");
    toast("Code copied to clipboard!");
  };
  const handleSave = () => {
    if (!isSignedIn) {
      toast("Please sign in to save your code.");
      return;
    }
    toast("Code saved!");
  };
  const handleShare = () => {
    setShareModalOpen(true);
  };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("// Type your code here...");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Enter paste title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <span>{isPublic ? "Public" : "Private"}</span>
                {isPublic ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </div>
              <Switch
                id="visibility"
                checked={isPublic}
                disabled={!isSignedIn}
                onCheckedChange={setIsPublic}
              />
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>
          </div>
        </div>

        <div className="relative">
          <Card>
            <CardContent className="p-0">
              <div className="h-[600px] relative">
                <MonacoWrapper
                  language={language}
                  value={content}
                  onChange={() => {}}
                />
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    variant="secondary"
                    className="shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90 transition-all duration-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                    className="shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90 transition-all duration-200 btn-hover"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>

                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="shadow-lg backdrop-blur-sm transition-all duration-200 btn-hover "
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Lines: {content.split("\n").length}</span>
            <span>Characters: {content.length}</span>
            <span>Language: {language}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Auto-save:</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          pasteId={savedPasteId || ""}
          title={title}
        />
      </div>
    </div>
  );
}
