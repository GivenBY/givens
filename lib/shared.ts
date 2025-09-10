import { ReadonlyURLSearchParams } from "next/navigation";

const allowedCallbackSet: ReadonlySet<string> = new Set(["/"]);

export const getCallbackURL = (
    queryParams: ReadonlyURLSearchParams | { [key: string]: string }
): string => {
    let callbackUrl: string | null = null;

    if (queryParams instanceof URLSearchParams) {
        callbackUrl = queryParams.get("callbackUrl");
    } else {
        callbackUrl = queryParams["callbackUrl"] ?? null;
    }

    if (callbackUrl && allowedCallbackSet.has(callbackUrl)) {
        return callbackUrl;
    }
    return "/";
};
