import { createAuthClient } from "better-auth/react";
import { lastLoginMethodClient, oneTapClient } from "better-auth/client/plugins";
console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [lastLoginMethodClient()
        , oneTapClient({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            promptOptions: { maxAttempts: 10 },
        }),
    ],
})

export const { signIn, signUp, signOut, useSession } = authClient;