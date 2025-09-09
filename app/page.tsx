"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CodeEditor from "@/components/editor/CodeEditor";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorStats } from "@/components/editor/EditorStats";
import { validateTitle, sanitizeInput } from "@/lib/security";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(`// Welcome to Givens\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`);
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const handleTitleChange = useCallback((newTitle: string) => {
    const sanitizedTitle = sanitizeInput(newTitle);

    if (!validateTitle(sanitizedTitle) && sanitizedTitle.length > 0) {
      toast.error("Title must be between 1 and 100 characters");
      return;
    }

    setTitle(sanitizedTitle);
  }, []);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
  }, []);

  const handleVisibilityChange = useCallback((newIsPublic: boolean) => {
    setIsPublic(newIsPublic);
  }, []);

  const handleSave = useCallback(async (data: {
    title: string;
    code: string;
    language: string;
    isPublic: boolean;
  }) => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          content: data.code,
          language: data.language,
          isPublic: data.isPublic,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save paste');
      }

      const session = await authClient.getSession();

      toast.success(result.message || 'Paste saved successfully!', {
        position: "bottom-center",
        action: {
          label: "View",
          onClick: () => router.push(`/paste/${result.paste.shortUrl}`),
        },
      });

      const fullUrl = result.paste.fullUrl || `${window.location.origin}/paste/${result.paste.shortUrl}`;
      await navigator.clipboard.writeText(fullUrl);

      if (!session) {
        toast.info("💡 Sign in to save pastes permanently!", {
          position: "bottom-center",
          duration: 5000,
        });
      }

    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save paste');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, router]);

  return (
    <div className="p-4 space-y-4 container mx-auto max-w-7xl">
      <EditorHeader
        title={title}
        onTitleChange={handleTitleChange}
        isPublic={isPublic}
        onVisibilityChange={handleVisibilityChange}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      <CodeEditor
        code={code}
        setCode={setCode}
        language={language}
        onSave={handleSave}
        title={title}
        isPublic={isPublic}
      />
      <EditorStats
        content={code}
        language={language}
      />
    </div>
  );
}
