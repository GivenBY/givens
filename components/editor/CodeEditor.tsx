"use client";

import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";
import "prismjs/themes/prism-tomorrow.css";
import { Copy, Save, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    language: string;
}

export default function CodeEditor({ code, setCode, language }: CodeEditorProps) {
    loadLanguages([language]);

    const handleSave = () => {
        toast.success("Code saved successfully", { position: "bottom-center" });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(code);
        toast.success("Code copied for sharing", { position: "bottom-center" });
    };

    return (
        <div
            className="relative"
            style={{
                height: "550px",
                overflow: "auto",
                borderRadius: "0.75rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "#1E1E1E",
            }}
        >
            <Button
                variant="outline"
                size="sm"
                className="absolute right-4 top-4 z-50 flex items-center gap-1 
             px-2 py-1 rounded-md text-xs font-medium
             text-muted-foreground hover:text-primary transition"
                onClick={() => {
                    navigator.clipboard.writeText(code);
                    toast.success("Code copied to clipboard", { position: "bottom-center" });
                }}
            >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
            </Button>


            <div className="absolute bottom-4 right-4 z-50 flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-xs font-medium"
                    onClick={handleShare}
                >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1 text-xs font-medium"
                    onClick={handleSave}
                >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                </Button>
            </div>

            <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) =>
                    Prism.highlight(
                        code,
                        Prism.languages[language] || Prism.languages.plaintext,
                        language
                    )
                }
                className="focus:outline-none focus:ring-0"
                padding={12}
                style={{
                    fontFamily: '"Fira Code", monospace',
                    fontSize: 14,
                    minHeight: "100%",
                    color: "#f8f8f2",
                    whiteSpace: "pre",
                }}
            />
        </div>
    );
}
