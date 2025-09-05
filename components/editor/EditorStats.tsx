"use client";

interface EditorStatsProps {
    content: string;
    language: string;
}

export const EditorStats = ({ content }: EditorStatsProps) => {
    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-5">
            <div className="flex items-center space-x-4">
                <span>Lines: {content.length === 0 ? 0 : content.split("\n").length}</span>
                <span>Characters: {content.length}</span>
            </div>

            {/* TODO: Implement auto-save indicator */}
            {/* <div className="flex items-center space-x-2">
                <span>Auto-save:</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div> */}
        </div>
    );
};