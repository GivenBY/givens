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
import {
    ArrowBigUp,
    ArrowUpDown,
    Copy,
    Edit,
    ExternalLink,
    Eye,
    Filter,
    Plus,
    Search,
    Share2,
    Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function MyPastes() {
    const [searchTerm, setSearchTerm] = useState("");
    const [languageFilter, setLanguageFilter] = useState("all");
    const [sortOption, setSortOption] = useState("mostupvoted");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [pastes, setPastes] = useState<any[]>([]);

    const observerRef = useRef<HTMLDivElement | null>(null);

    const languages = [
        "javascript", "python", "java", "csharp", "cpp", "ruby", "go", "php",
        "typescript", "swift", "kotlin", "rust", "scala", "haskell", "perl",
        "lua", "dart", "elixir", "clojure",
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

    const fetchPastes = useCallback(async (page: number) => {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newPastes = Array.from({ length: 5 }).map((_, i) => ({
            _id: `${page}-${i}`,
            title: `Sample Paste ${page}-${i}`,
            content:
                "console.log('Hello World');\nfunction test() {\n  return true;\n}\nconsole.log(test());",
            language: "javascript",
            isPublic: true,
            views: Math.floor(Math.random() * 100),
            copies: Math.floor(Math.random() * 20),
            upvotes: Math.floor(Math.random() * 50),
            createdAt: new Date(),
        }));

        if (page >= 4) setHasMore(false);

        setPastes((prev) => [...prev, ...newPastes]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPastes(page);
    }, [page, fetchPastes]);

    useEffect(() => {
        if (!observerRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [loading, hasMore]);

    const filteredPastes = pastes
        .filter((paste) =>
            (languageFilter === "all" || paste.language === languageFilter) &&
            paste.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOption === "latest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortOption === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortOption === "az") return a.title.localeCompare(b.title);
            if (sortOption === "za") return b.title.localeCompare(a.title);
            if (sortOption === "mostviewed") return (b.views || 0) - (a.views || 0);
            if (sortOption === "leastviewed") return (a.views || 0) - (b.views || 0);
            if (sortOption === "mostcoppied") return (b.copies || 0) - (a.copies || 0);
            if (sortOption === "mostupvoted") return (b.upvotes || 0) - (a.upvotes || 0);
            return 0;
        });

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const handleShare = (paste: any) => {
        const url = `${window.location.origin}/paste/${paste._id}`;
        navigator.clipboard.writeText(url);
        alert("Share link copied!");
    };

    const handleDelete = (paste: any) => {
        if (confirm(`Delete "${paste.title}"?`)) {
            setPastes((prev) => prev.filter((p) => p._id !== paste._id));
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold">My Pastes</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage and organize your code snippets with ease
                    </p>
                </div>
                <Button onClick={() => (window.location.href = "/")}>
                    <Plus className="h-4 w-4 mr-2" /> New Paste
                </Button>
            </div>

            <Card>
                <CardContent className="px-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search pastes..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Select value={languageFilter} onValueChange={setLanguageFilter}>
                                <SelectTrigger className="flex-1 sm:w-60">
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
                                <SelectTrigger className="flex-1 sm:w-48">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPastes.map((paste) => (
                    <Card key={paste._id} className="group hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-lg truncate">{paste.title}</CardTitle>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Badge variant="secondary">{paste.language}</Badge>
                                        <Badge variant={paste.isPublic ? "default" : "outline"}>
                                            {paste.isPublic ? "Public" : "Private"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-muted p-3 rounded-md">
                                    <code className="text-sm font-mono text-foreground block whitespace-pre-wrap">
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
                                    <Button variant="outline" size="sm" onClick={() => (window.location.href = `/paste/${paste._id}`)} title="View paste">
                                        <ExternalLink className="h-3 w-3" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => (window.location.href = `/edit/${paste._id}`)} title="Edit paste">
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleCopy(paste.content)} title="Copy content">
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleShare(paste)} title="Share paste">
                                        <Share2 className="h-3 w-3" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(paste)} title="Delete paste">
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {!loading && filteredPastes.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground space-y-4">
                        <p className="text-lg font-medium">No pastes found</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setLanguageFilter("all");
                                setSortOption("latest");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

            </div>

            {loading && <p className="text-center text-muted-foreground py-4">Loading...</p>}
            <div ref={observerRef} />
        </div>
    );
}
