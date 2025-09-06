import { ReadonlyURLSearchParams } from "next/navigation";

const allowedCallbackSet: ReadonlySet<string> = new Set([
    "/",
]);

export const getCallbackURL = (
    queryParams: ReadonlyURLSearchParams,
): string => {
    const callbackUrl = queryParams.get("callbackUrl");
    if (callbackUrl) {
        if (allowedCallbackSet.has(callbackUrl)) {
            return callbackUrl;
        }
        return "/";
    }
    return "/";
};