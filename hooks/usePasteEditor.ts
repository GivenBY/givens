"use client";
import { pasteService } from "@/lib/api";
import { EDITOR_CONFIG, TOAST_MESSAGES } from "@/lib/constants";
import type { Paste } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export interface UsePasteEditorReturn {
  language: string;
  isPublic: boolean;
  shareModalOpen: boolean;
  savedPasteId: string;
  title: string;
  content: string;

  setLanguage: (language: string) => void;
  setIsPublic: (isPublic: boolean) => void;
  setShareModalOpen: (open: boolean) => void;
  setSavedPasteId: (id: string) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;

  handleCopy: () => void;
  handleSave: () => Promise<void>;
  handleShare: () => void;

  isSignedIn: boolean | undefined;
}

export const usePasteEditor = (
  initialPaste?: Paste,
  isEditing: boolean = false
): UsePasteEditorReturn => {
  const [language, setLanguage] = useState<string>(
    initialPaste?.language || EDITOR_CONFIG.DEFAULT_LANGUAGE
  );
  const [isPublic, setIsPublic] = useState(initialPaste?.isPublic ?? true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [savedPasteId, setSavedPasteId] = useState<string>(
    initialPaste?._id || ""
  );
  const [title, setTitle] = useState<string>(initialPaste?.title || "");
  const [content, setContent] = useState<string>(
    initialPaste?.content || EDITOR_CONFIG.DEFAULT_CONTENT
  );
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (initialPaste) {
      setLanguage(initialPaste.language);
      setIsPublic(initialPaste.isPublic);
      setSavedPasteId(initialPaste._id);
      setTitle(initialPaste.title);
      setContent(initialPaste.content);
    }
  }, [initialPaste]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast(TOAST_MESSAGES.COPY_SUCCESS);
  };

  const handleSave = async () => {
    if (!isSignedIn) {
      toast.warning(TOAST_MESSAGES.SIGN_IN_REQUIRED);
      return;
    }

    try {
      let response;

      if (isEditing && savedPasteId) {
        response = await pasteService.update({
          id: savedPasteId,
          title,
          content,
          language,
          isPublic,
        });

        if (response.success && response.data) {
          toast.success("Paste updated successfully!");
        } else {
          throw new Error(response.error || "Failed to update");
        }
      } else {
        response = await pasteService.create({
          title,
          content,
          language,
          isPublic,
        });

        if (response.success && response.data) {
          setSavedPasteId(response.data._id);
          toast.success(TOAST_MESSAGES.SAVE_SUCCESS);
        } else {
          throw new Error(response.error || "Failed to save");
        }
      }
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update paste" : TOAST_MESSAGES.SAVE_ERROR
      );
    }
  };

  const handleShare = async () => {
    await pasteService
      .create({
        title,
        content,
        language,
        isPublic,
        anonEditId: isSignedIn ? undefined : uuidv4(),
      })
      .then((response) => {
        if (response.success && response.data) {
          const newId = response.data._id;
          setSavedPasteId(newId);
          toast.success(TOAST_MESSAGES.SAVE_SUCCESS);
        } else {
          throw new Error(response.error || "Failed to create share link");
        }
      });

    setShareModalOpen(true);
  };

  return {
    language,
    isPublic,
    shareModalOpen,
    savedPasteId,
    title,
    content,

    setLanguage,
    setIsPublic,
    setShareModalOpen,
    setSavedPasteId,
    setTitle,
    setContent,

    handleCopy,
    handleSave,
    handleShare,

    isSignedIn,
  };
};
