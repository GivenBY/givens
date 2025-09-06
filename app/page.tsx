"use client";

import { useState } from "react";

import CodeEditor from "@/components/editor/CodeEditor";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorStats } from "@/components/editor/EditorStats";

export default function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(`// Example code\nfunction add(a, b) {\n  return a + b;\n}`);
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  return (
    <div className="p-4 space-y-4 container mx-auto max-w-7xl">
      <EditorHeader title={title} onTitleChange={setTitle} isPublic={isPublic} onVisibilityChange={setIsPublic} language={language} onLanguageChange={setLanguage} />
      <CodeEditor code={code} setCode={setCode} language={language} />
      <EditorStats content={code} language={language} />
    </div>
  );
}
