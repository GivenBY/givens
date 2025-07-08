"use client";
import { MonacoWrapper } from "@/components/editor/MonacoWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Save, Share2 } from "lucide-react";

interface EditorAreaProps {
  language: string;
  content: string;
  onContentChange: (content: string) => void;
  onCopy: () => void;
  onSave: () => void;
  onShare: () => void;
}

export const EditorArea = ({
  language,
  content,
  onContentChange,
  onCopy,
  onSave,
  onShare,
}: EditorAreaProps) => {
  return (
    <div className="relative">
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px] relative">
            <MonacoWrapper
              language={language}
              value={content}
              onChange={(val) => onContentChange(val || "")}
            />

            {/* Copy Button */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                onClick={onCopy}
                size="sm"
                variant="secondary"
                className="shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90 transition-all duration-200"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Save + Share Buttons */}
            <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
              <Button
                onClick={onShare}
                variant="outline"
                size="sm"
                className="shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90 transition-all duration-200 btn-hover"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={onSave}
                size="sm"
                className="shadow-lg backdrop-blur-sm transition-all duration-200 btn-hover"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
