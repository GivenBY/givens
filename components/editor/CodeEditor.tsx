"use client";

import { useCallback, useMemo, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";
import "prismjs/themes/prism-tomorrow.css";
import { Copy, Save, Share2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { validateCode, validateLanguage } from "@/lib/security";
import { logger } from "@/lib/errors";

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    language: string;
    onSave?: (data: { title: string; code: string; language: string; isPublic: boolean }) => Promise<void>;
    title?: string;
    isPublic?: boolean;
}

const MAX_CODE_LENGTH = 100000; // 100KB limit

export default function CodeEditor({
    code,
    setCode,
    language,
    onSave,
    title = "",
    isPublic = false
}: CodeEditorProps) {
    const [isLoading, setIsLoading] = useState(false);

    const validatedLanguage = useMemo(() => {
        if (!validateLanguage(language)) {
            logger.warn(`Invalid language attempted: ${language}`);
            return 'javascript';
        }
        return language;
    }, [language]);

    useMemo(() => {
        try {
            loadLanguages([validatedLanguage]);
        } catch (error) {
            logger.error('Failed to load Prism language', error);
        }
    }, [validatedLanguage]);

    const handleCodeChange = useCallback((value: string) => {
        if (!validateCode(value)) {
            toast.error(`Code too long. Maximum ${MAX_CODE_LENGTH.toLocaleString()} characters allowed.`);
            return;
        }

        setCode(value);
    }, [setCode]);

    const handleSave = useCallback(async () => {
        if (!validateCode(code)) {
            toast.error("Cannot save: Code validation failed");
            return;
        }

        if (!title.trim()) {
            toast.error("Please enter a title for your paste");
            return;
        }

        setIsLoading(true);
        try {
            if (onSave) {
                await onSave({ title, code, language: validatedLanguage, isPublic });
            } else {
                await new Promise(resolve => setTimeout(resolve, 500));
                toast.success("Code saved successfully", { position: "bottom-center" });
            }
        } catch (error) {
            logger.error('Failed to save code', error);
            toast.error("Failed to save code");
        } finally {
            setIsLoading(false);
        }
    }, [code, title, validatedLanguage, isPublic, onSave]);

    const handleShare = useCallback(async () => {
        if (!validateCode(code)) {
            toast.error("Cannot share: Code validation failed");
            return;
        }

        try {
            await navigator.clipboard.writeText(code);
            toast.success("Code copied for sharing", { position: "bottom-center" });
        } catch (error) {
            logger.error('Failed to copy to clipboard', error);
            toast.error("Failed to copy code");
        }
    }, [code]);

    const handleCopyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success("Code copied to clipboard", { position: "bottom-center" });
        } catch (error) {
            logger.error('Failed to copy to clipboard', error);
            toast.error("Failed to copy code");
        }
    }, [code]);

    const highlight = useCallback((code: string) => {
        try {
            return Prism.highlight(code, Prism.languages[validatedLanguage] || Prism.languages.javascript, validatedLanguage);
        } catch (error) {
            logger.error('Prism highlighting failed', error);
            return code;
        }
    }, [validatedLanguage]);

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
            <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                             text-muted-foreground hover:text-primary transition"
                    onClick={handleCopyToClipboard}
                    disabled={!code.trim()}
                >
                    <Copy className="h-3 w-3" />
                    Copy
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                             text-muted-foreground hover:text-primary transition"
                    onClick={handleShare}
                    disabled={!code.trim()}
                >
                    <Share2 className="h-3 w-3" />
                    Share
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                             text-muted-foreground hover:text-primary transition"
                    onClick={handleSave}
                    disabled={!code.trim() || !title.trim() || isLoading}
                >
                    <Save className="h-3 w-3" />
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>

            {code.length > MAX_CODE_LENGTH * 0.8 && (
                <div className="absolute left-4 top-4 z-50 flex items-center gap-1 px-2 py-1 
                               bg-yellow-500/20 border border-yellow-500/30 rounded-md text-xs">
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    <span className="text-yellow-500">
                        {((1 - code.length / MAX_CODE_LENGTH) * 100).toFixed(0)}% space remaining
                    </span>
                </div>
            )}

            <Editor
                value={code}
                onValueChange={handleCodeChange}
                highlight={highlight}
                padding={20}
                style={{
                    fontFamily: 'var(--font-geist-mono), "Courier New", Courier, monospace',
                    fontSize: "14px",
                    lineHeight: "1.5",
                    minHeight: "550px",
                    background: "transparent",
                    outline: "none",
                }}
                placeholder="Start typing your code here..."
            />
        </div>
    );
}
