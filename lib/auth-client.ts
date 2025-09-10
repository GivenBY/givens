import { createAuthClient } from "better-auth/react";
import { lastLoginMethodClient, oneTapClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    plugins: [
        lastLoginMethodClient(),
        oneTapClient({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            promptOptions: { maxAttempts: 10 },
        }),
    ],
})

export const { signIn, signUp, signOut, useSession } = authClient;