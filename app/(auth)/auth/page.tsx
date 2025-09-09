"use client";

import SignIn from "@/components/signin";
import { SignUp } from "@/components/signup";
import { Tabs } from "@/components/ui/tabs2";
import { authClient } from "@/lib/auth-client";
import { getCallbackURL } from "@/lib/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (!isPending && session) {
            router.push("/");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        authClient.oneTap({
            fetchOptions: {
                onError: ({ error }) => {
                    toast.error(error.message || "An error occurred");
                },
                onSuccess: () => {
                    toast.success("Successfully signed in");
                    router.push(getCallbackURL(params));
                },
            },
        });
    }, [params, router]);

    if (isPending || session) {
        return null;
    }
    return (
        <div className="w-full">
            <div className="flex items-center flex-col justify-center w-full md:py-10">
                <div className="md:w-[400px]">
                    <Tabs
                        tabs={[
                            {
                                title: "Sign In",
                                value: "sign-in",
                                content: <SignIn />,
                            },
                            {
                                title: "Sign Up",
                                value: "sign-up",
                                content: <SignUp />,
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
