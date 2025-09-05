import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { editorThemes } from "@/data/editorThemes";
import React from "react";

interface ThemeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    value,
    onChange,
}) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="">
                <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
                {editorThemes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                        <div className="flex items-center gap-2">
                            {theme.label}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
