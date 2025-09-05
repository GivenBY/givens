"use client";

import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";
import "prismjs/themes/prism-tomorrow.css";

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    language: string;
}

export default function CodeEditor({ code, setCode, language }: CodeEditorProps) {
    loadLanguages([language]);

    return (
        <div
            style={{
                height: "550px",
                overflow: "auto",
                borderRadius: "0.75rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "#1E1E1E",
            }}
        >
            <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) =>
                    Prism.highlight(
                        code,
                        Prism.languages[language] || Prism.languages.plaintext,
                        language
                    )
                }
                className="focus:outline-none focus:ring-0"
                padding={12}
                style={{
                    fontFamily: '"Fira Code", monospace',
                    fontSize: 14,
                    minHeight: "100%",
                    color: "#f8f8f2",
                    whiteSpace: "pre",
                }}
            />
        </div>
    );
}
