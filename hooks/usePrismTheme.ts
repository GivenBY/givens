import { editorThemes } from "@/data/editorThemes";
import { useEffect } from "react";

export function usePrismTheme(theme: string) {
    useEffect(() => {
        const themeObj = editorThemes.find((t) => t.value === theme);
        if (!themeObj) return;

        // remove any old theme <link>
        const oldLink = document.getElementById("prism-theme") as HTMLLinkElement;
        if (oldLink) oldLink.remove();

        // add new theme <link>
        const link = document.createElement("link");
        link.id = "prism-theme";
        link.rel = "stylesheet";
        link.href = `/themes/${themeObj.css}`; // put your css in public/themes/
        document.head.appendChild(link);
    }, [theme]);
}
