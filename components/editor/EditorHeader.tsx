"use client";

import { useCallback } from "react";
import { LanguageSelector } from "@/components/editor/LanguageSelector";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";
import { validateTitle } from "@/lib/security";

interface EditorHeaderProps {
    title: string;
    onTitleChange: (title: string) => void;
    isPublic: boolean;
    onVisibilityChange: (isPublic: boolean) => void;
    language: string;
    onLanguageChange: (language: string) => void;
}

export const EditorHeader = ({
    title,
    onTitleChange,
    isPublic,
    onVisibilityChange,
    language,
    onLanguageChange
}: EditorHeaderProps) => {

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onTitleChange(value);
    }, [onTitleChange]);

    const handleVisibilityToggle = useCallback((checked: boolean) => {
        onVisibilityChange(checked);
    }, [onVisibilityChange]);

    const handleLanguageChange = useCallback((newLanguage: string) => {
        onLanguageChange(newLanguage);
    }, [onLanguageChange]);

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md w-full">
                <Input
                    placeholder="Enter paste title..."
                    value={title}
                    onChange={handleTitleChange}
                    className="text-lg font-medium"
                    maxLength={100}
                    aria-label="Paste title"
                />
                {title.length > 80 && (
                    <p className="text-xs text-yellow-600 mt-1">
                        {100 - title.length} characters remaining
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-around">
                    <div className="flex items-center space-x-2 text-sm font-medium">
                        <span>{isPublic ? "Public" : "Private"}</span>
                        {isPublic ? (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                        )}
                    </div>
                    <Switch
                        checked={isPublic}
                        onCheckedChange={handleVisibilityToggle}
                        aria-label={`Make paste ${isPublic ? 'private' : 'public'}`}
                    />
                    <LanguageSelector
                        value={language}
                        onChange={handleLanguageChange}
                    />
                </div>
            </div>
        </div>
    );
};