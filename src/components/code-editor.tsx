"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  onChange: (key: string, value: string) => void;
  language: string;
  code: string;
  theme: string;
}

export default function CodeEditor({ onChange, language, code, theme }: CodeEditorProps) {
    const [value, setValue] = useState(code || "");

    const handleEditorChange = (value: string) => {
        setValue(value);
        onChange("code", value);
    };

    return (
        <div>
            <Editor height="85vh" width={`100%`} language={language || "javascript"} theme={theme} value={value} onChange={(newValue) => handleEditorChange(newValue || "")} />
        </div>
    );
};