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
import { mockPastes } from "@/lib/mockData";
import { Copy, Edit, Eye, Filter, Search, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPaste, setSelectedPaste] = useState<any>(null);

  const filteredPastes = mockPastes.filter((paste) => {
    const matchesSearch =
      paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paste.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage =
      languageFilter === "all" || paste.language === languageFilter;
    return matchesSearch && matchesLanguage;
  });

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

  const confirmDelete = () => {
    toast("The paste has been successfully deleted.");
    setDeleteModalOpen(false);
    setSelectedPaste(null);
  };

  const languages = [...new Set(mockPastes.map((p) => p.language))];

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
            <Button>
              <Edit className="h-4 w-4 mr-2" />
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

        {/* Pastes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPastes.map((paste) => (
            <Card
              key={paste.id}
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
                        <span>{paste.views}</span>
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
                      onClick={() => handleCopy(paste.content)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(paste)}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(paste)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPastes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">
                {searchTerm || languageFilter !== "all"
                  ? "No pastes found matching your criteria."
                  : "You haven't created any pastes yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        pasteId={selectedPaste?.id || ""}
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
