"use client";
import { PasteEditor } from "@/components/features/editor";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

function AuthRedirectHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("auth") === "required") {
      toast.warning("Please sign in to access that page.");
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("auth");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);

  return null;
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <AuthRedirectHandler />
      </Suspense>
      <PasteEditor />
    </>
  );
}
