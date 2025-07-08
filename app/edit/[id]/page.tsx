"use client";
import { PasteEditor } from "@/components/features/editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePasteApi } from "@/hooks";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditPastePage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, userId, isLoaded } = useAuth();
  const pasteId = params.id as string;

  const { getById: getPaste } = usePasteApi();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (pasteId && isLoaded) {
      getPaste.execute(pasteId);
    }
  }, [pasteId, isLoaded]);

  useEffect(() => {
    if (getPaste.data?.success && getPaste.data.data && userId && isLoaded) {
      // Check if the current user is the author of this paste
      const isAuthor = getPaste.data.data.authorId === userId;
      setAuthorized(isAuthor);

      if (!isAuthor) {
        toast.error("You don't have permission to edit this paste.");
        router.push(`/paste/${pasteId}`);
      }
    } else if (
      getPaste.data?.success &&
      getPaste.data.data &&
      !userId &&
      isLoaded
    ) {
      // Not signed in
      setAuthorized(false);
      toast.error("You must be signed in to edit pastes.");
      router.push(`/paste/${pasteId}`);
    }
  }, [getPaste.data, userId, pasteId, router, isLoaded]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              You must be signed in to edit pastes.
            </p>
            <Button onClick={() => router.push(`/paste/${pasteId}`)}>
              View Paste Instead
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (getPaste.loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (getPaste.error || !getPaste.data?.success) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 mb-4">
              Error:{" "}
              {getPaste.error || getPaste.data?.error || "Failed to load paste"}
            </p>
            <Button onClick={() => router.push("/mypastes")}>
              Back to My Pastes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              You don't have permission to edit this paste.
            </p>
            <Button onClick={() => router.push(`/paste/${pasteId}`)}>
              View Paste Instead
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <PasteEditor initialPaste={getPaste.data.data} isEditing={true} />;
}
