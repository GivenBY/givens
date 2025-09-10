// app/auth/page.tsx
import { Suspense } from "react";
import AuthContent from "./auth-content";

export default function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
    return (
        <Suspense fallback={null}>
            <AuthContent searchParams={searchParams} />
        </Suspense>
    );
}
