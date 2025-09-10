"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { getCallbackURL } from "@/lib/shared";
import { Tabs } from "@/components/ui/tabs2";
import SignIn from "@/components/signin";
import { SignUp } from "@/components/signup";

export default function AuthContent({ searchParams }: { searchParams: { [key: string]: string } }) {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (!isPending && session) router.push("/");
    }, [session, isPending, router]);

    useEffect(() => {
        authClient.oneTap({
            fetchOptions: {
                onError: ({ error }) => {
                    console.error("OneTap error:", error);
                    toast.error(error?.message || "An error occurred");
                },
                onSuccess: () => {
                    toast.success("Successfully signed in");
                    router.push(getCallbackURL(searchParams));
                },
            },
        });
    }, [searchParams, router]);

    if (isPending || session) return null;

    const tabs = [
        {
            title: "Sign In",
            value: "signin",
            content: <SignIn />,
        },
        {
            title: "Sign Up",
            value: "signup",
            content: <SignUp />,
        },
    ];

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Tabs
                    tabs={tabs}
                    containerClassName="justify-center"
                />
            </div>
        </div>
    );
}
