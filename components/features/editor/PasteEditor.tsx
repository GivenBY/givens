"use client";
import { ShareModal } from "@/components/modals/ShareModal";
import { usePasteEditor } from "@/hooks/usePasteEditor";
import type { Paste } from "@/types";
import { EditorArea } from "./EditorArea";
import { EditorHeader } from "./EditorHeader";
import { EditorStats } from "./EditorStats";

interface PasteEditorProps {
  initialPaste?: Paste;
  isEditing?: boolean;
}

export const PasteEditor = ({
  initialPaste,
  isEditing = false,
}: PasteEditorProps) => {
  const {
    language,
    isPublic,
    shareModalOpen,
    savedPasteId,
    title,
    content,
    setLanguage,
    setIsPublic,
    setShareModalOpen,
    setTitle,
    setContent,
    handleCopy,
    handleSave,
    handleShare,
    isSignedIn,
  } = usePasteEditor(initialPaste, isEditing);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-6">
        <EditorHeader
          title={title}
          onTitleChange={setTitle}
          isPublic={isPublic}
          onVisibilityChange={setIsPublic}
          language={language}
          onLanguageChange={setLanguage}
          isSignedIn={isSignedIn}
        />

        <EditorArea
          language={language}
          content={content}
          onContentChange={setContent}
          onCopy={handleCopy}
          onSave={handleSave}
          onShare={handleShare}
        />

        <EditorStats content={content} language={language} />

        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          pasteId={savedPasteId}
          title={title}
        />
      </div>
    </div>
  );
};
