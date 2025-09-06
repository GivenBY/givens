"use client";
import { LanguageSelector } from "@/components/editor/LanguageSelector";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";

interface EditorHeaderProps {
    title: string;
    onTitleChange: (title: string) => void;
    isPublic: boolean;
    onVisibilityChange: (isPublic: boolean) => void;
    language: string;
    onLanguageChange: (language: string) => void;
    // isSignedIn: boolean | undefined;
}

export const EditorHeader = ({ title, onTitleChange, isPublic, onVisibilityChange, language, onLanguageChange }: EditorHeaderProps) => {


    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md w-full">
                <Input
                    placeholder="Enter paste title..."
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="text-lg font-medium"
                />
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-around">
                    <div className="flex items-center space-x-2 text-sm font-medium">
                        <span>{isPublic ? "Public" : "Private"}</span>
                        {isPublic ? (
                            <Eye className="h-4 w-4" />
                        ) : (
                            <EyeOff className="h-4 w-4" />
                        )}
                    </div>
                    <Switch checked={isPublic} onCheckedChange={onVisibilityChange} />
                    <LanguageSelector value={language} onChange={onLanguageChange} />
                </div>
            </div>
        </div>
    );
};