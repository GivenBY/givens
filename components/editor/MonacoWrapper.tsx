"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface MonacoWrapperProps {
  language?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
}

export const MonacoWrapper = ({
  language = "javascript",
  value = "Type your code here...",
  onChange,
}: MonacoWrapperProps) => {
  return (
    <div className="w-full h-full border border-border rounded-lg overflow-hidden">
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        options={{
          bracketPairColorization: {
            enabled: true,
            independentColorPoolPerBracketType: false,
          },
          "semanticHighlighting.enabled": true,
          readOnly: false,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "Fira Code, Monaco, Consolas, monospace",
          lineNumbers: "on",
          renderWhitespace: "selection",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          padding: { top: 16, bottom: 16 },
          fontLigatures: true,
          contextmenu: false,
          guides: {
            indentation: false,
          },
        }}
        theme="vs-dark"
      />
    </div>
  );
};
