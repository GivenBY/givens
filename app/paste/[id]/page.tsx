"use client";
import { MonacoWrapper } from "@/components/editor/MonacoWrapper";
import { ShareModal } from "@/components/modals/ShareModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePasteApi } from "@/hooks";
import { ArrowLeft, Copy, Edit, Eye, Share2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PastePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { getById: getPaste } = usePasteApi();

  useEffect(() => {
    if (id) {
      getPaste.execute(id);
    }
  }, [id]);

  // Extract the paste data, loading, and error from the API response
  const paste = getPaste.data?.data;
  const loading = getPaste.loading;
  const error =
    getPaste.error || (!getPaste.data?.success ? getPaste.data?.error : null);

  const handleCopy = async () => {
    if (!paste) return;
    try {
      await navigator.clipboard.writeText(paste.content);
      toast("The paste content has been copied to your clipboard.");
    } catch (err) {
      toast("Failed to copy. Please copy the content manually.");
    }
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-24" />
            <div className="flex-1">
              <Skeleton className="h-8 w-1/2 mb-2" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>

          {/* Actions Skeleton */}
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>

          {/* Content Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 mb-4">
              {error === "Paste not found"
                ? "This paste doesn't exist or has been deleted."
                : `Error: ${error}`}
            </p>
            <div className="space-x-2">
              <Button onClick={() => router.back()} variant="outline">
                Go Back
              </Button>
              <Button onClick={() => router.push("/")}>Create New Paste</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Paste not found.</p>
            <Button onClick={() => router.push("/")}>Create New Paste</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{paste.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{paste.language}</Badge>
                <Badge variant={paste.isPublic ? "default" : "outline"}>
                  {paste.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{paste.views} views</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {paste.authorName && <span>by {paste.authorName} • </span>}
              Created {new Date(paste.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCopy} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button onClick={handleShare} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={() => router.push("/")} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Create New Paste
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Content</span>
              <Badge variant="outline">{paste.language}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden max-h-[480px]">
              <MonacoWrapper
                value={paste.content}
                language={paste.language}
                readOnly={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        pasteId={paste._id}
        title={paste.title}
      />
    </div>
  );
}
