"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { getCallbackURL } from "@/lib/shared";

export default function AuthContent({ searchParams }: { searchParams: { [key: string]: string } }) {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (!isPending && session) router.push("/");
    }, [session, isPending, router]);

    useEffect(() => {
        authClient.oneTap({
            fetchOptions: {
                onError: ({ error }) => { toast.error(error?.message || "An error occurred"); },
                onSuccess: () => {
                    toast.success("Successfully signed in");
                    router.push(getCallbackURL(searchParams));
                },
            },
        });
    }, [searchParams, router]);

    if (isPending || session) return null;

    return <div>...your tabs...</div>;
}
