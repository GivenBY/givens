"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowBigUp, ArrowUpDown, Copy, ExternalLink, Eye, Filter, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Explore() {
    const [searchTerm, setSearchTerm] = useState("");
    const [languageFilter, setLanguageFilter] = useState("all");
    const [sortOption, setSortOption] = useState("mostupvoted");
    const [loading, setLoading] = useState(false);

    const [pastes, setPastes] = useState([
        {
            _id: "1",
            title: "Sorting in Python",
            content: "nums = [5, 2, 9]\nnums.sort()\nprint(nums)",
            language: "python",
            isPublic: true,
            views: 42,
            upvotes: 10,
            copies: 5,
            createdAt: new Date("2025-08-21"),
        },
        {
            _id: "2",
            title: "Hello World in Go",
            content: "package main\nimport \"fmt\"\nfunc main() {\n fmt.Println(\"Hello, Go!\")\n}",
            language: "go",
            isPublic: true,
            views: 10,
            upvotes: 2,
            copies: 2,
            createdAt: new Date("2025-09-01"),
        },
    ]);

    const filteredPastes = pastes
        .filter(
            (paste) =>
                paste.isPublic &&
                (languageFilter === "all" || paste.language === languageFilter) &&
                paste.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOption === "latest")
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortOption === "oldest")
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortOption === "az") return a.title.localeCompare(b.title);
            if (sortOption === "za") return b.title.localeCompare(a.title);
            if (sortOption === "mostviewed") return (b.views || 0) - (a.views || 0);
            if (sortOption === "leastviewed") return (a.views || 0) - (b.views || 0);
            if (sortOption === "mostcoppied") return (b.copies || 0) - (a.copies || 0);
            return 0;
        });

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        toast.success("Code copied!", { position: "bottom-center" });
    };

    const handleShare = (paste: any) => {
        const url = `${window.location.origin}/paste/${paste._id}`;
        navigator.clipboard.writeText(url);
        toast.success("Share link copied!", { position: "bottom-center" });
    };

    const languages = [
        "javascript",
        "python",
        "java",
        "go",
        "cpp",
        "php",
        "typescript",
        "rust",
        "swift",
    ];

    const sortOptions = [
        { value: "mostupvoted", label: "Popular" },
        { value: "latest", label: "Latest" },
        { value: "oldest", label: "Oldest" },
        { value: "az", label: "A → Z" },
        { value: "za", label: "Z → A" },
        { value: "mostviewed", label: "Most Viewed" },
        { value: "leastviewed", label: "Least Viewed" },
        { value: "mostcoppied", label: "Most Copied" },
    ];

    return (
        <div className="flex flex-col space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Explore Public Pastes</h1>
                <p className="text-muted-foreground text-sm">
                    Browse public code snippets shared by the community
                </p>
            </div>

            <Card>
                <CardContent className="px-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    placeholder="Search pastes..."
                                    className="pl-3"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Select value={languageFilter} onValueChange={setLanguageFilter}>
                                <SelectTrigger className="flex-1 sm:w-52">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filter by language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Languages</SelectItem>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang} value={lang}>
                                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sortOption} onValueChange={setSortOption}>
                                <SelectTrigger className="flex-1 sm:w-44">
                                    <ArrowUpDown className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {!loading && filteredPastes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPastes.map((paste) => (
                        <Card key={paste._id} className="group hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg truncate">{paste.title}</CardTitle>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge variant="secondary">{paste.language}</Badge>
                                            <Badge variant="default">Public</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="bg-muted p-3 rounded-md">
                                        <code className="text-sm font-mono text-foreground block whitespace-pre-wrap line-clamp-3">
                                            {paste.content.split("\n").slice(0, 3).join("\n")}
                                            {paste.content.split("\n").length > 3 && "\n..."}
                                        </code>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <ArrowBigUp className="h-3 w-3" />
                                                <span>{paste.upvotes || 0}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Eye className="h-3 w-3" />
                                                <span>{paste.views || 0}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Copy className="h-3 w-3" />
                                                <span>{paste.copies || 0}</span>
                                            </div>
                                            <span>{new Date(paste.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => (window.location.href = `/paste/${paste._id}`)}
                                            title="View paste"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopy(paste.content)}
                                            title="Copy content"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleShare(paste)}
                                            title="Share paste"
                                        >
                                            <Share2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">No public pastes found.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
