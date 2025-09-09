"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function MyPastesLayoutClient({ children }: { children: ReactNode }) {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/");
        }
    }, [session, isPending, router]);

    if (isPending) return null;

    return <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>;
}
