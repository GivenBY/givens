"use client";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { ShareModal } from "@/components/modals/ShareModal";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPastes } from "@/hooks";
import {
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
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { pastes, loading, error, deletePaste } = useMyPastes();
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPaste, setSelectedPaste] = useState<any>(null);

  const filteredPastes = useMemo(() => {
    if (!pastes) return [];

    return pastes.filter((paste) => {
      const matchesSearch =
        paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paste.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLanguage =
        languageFilter === "all" || paste.language === languageFilter;
      return matchesSearch && matchesLanguage;
    });
  }, [pastes, searchTerm, languageFilter]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast("The paste content has been copied to your clipboard.");
    } catch (err) {
      toast("Failed to copy. Please copy the content manually.");
    }
  };

  const handleShare = (paste: any) => {
    setSelectedPaste(paste);
    setShareModalOpen(true);
  };

  const handleDelete = (paste: any) => {
    setSelectedPaste(paste);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedPaste) {
      try {
        await deletePaste(selectedPaste._id);
        setDeleteModalOpen(false);
        setSelectedPaste(null);
      } catch (error) {
        // Error is already handled in the hook
      }
    }
  };

  const languages = useMemo(() => {
    if (!pastes) return [];
    return [...new Set(pastes.map((p) => p.language))];
  }, [pastes]);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">My Pastes</h1>
            <p className="text-muted-foreground">
              Manage your code snippets and pastes
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => (window.location.href = "/")}>
              <Plus className="h-4 w-4 mr-2" />
              New Paste
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pastes..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-full sm:w-48">
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
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex space-x-2 mt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex justify-between text-xs">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && (!pastes || pastes.length === 0) && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground text-lg">No pastes found.</p>
              <p className="text-muted-foreground text-sm mt-2">
                Create your first paste to get started!
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="mt-4"
              >
                Create Paste
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pastes Grid */}
        {!loading && filteredPastes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPastes.map((paste) => (
              <Card
                key={paste._id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {paste.title}
                      </CardTitle>
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
                      <code className="text-sm font-mono text-foreground block truncate">
                        {paste.content.split("\n")[0]}
                      </code>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{paste.views || 0}</span>
                        </div>
                        <span>
                          {new Date(paste.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/paste/${paste._id}`)
                        }
                        title="View paste"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/edit/${paste._id}`)
                        }
                        title="Edit paste"
                      >
                        <Edit className="h-3 w-3" />
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(paste)}
                        title="Delete paste"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results State */}
        {!loading &&
          filteredPastes.length === 0 &&
          pastes &&
          pastes.length > 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">
                  No pastes found matching your criteria.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setLanguageFilter("all");
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        pasteId={selectedPaste?._id || ""}
        title={selectedPaste?.title || ""}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={selectedPaste?.title || ""}
      />
    </div>
  );
}
