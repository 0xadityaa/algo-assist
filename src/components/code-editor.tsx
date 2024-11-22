"use client";
import Editor from "@monaco-editor/react";
import { Dispatch, SetStateAction } from "react";

interface CodeEditorProps {
  language: string;
  code: string;
  theme: string;
  setCode: Dispatch<SetStateAction<string>>;
}

export default function CodeEditor({
  setCode,
  language,
  code,
  theme,
}: CodeEditorProps) {
  return (
    <div className="min-w-full">
      <Editor
        options={{
          fontSize: 20,
          scrollBeyondLastLine: false,
          theme: theme as string,
        }}
        className="rounded-xl text-lg"
        width={`100%`}
        language={language}
        theme={theme}
        value={code} // Bind the value to the code state
        onChange={(value) => setCode(value ?? "")} // Update the state on change
      />
    </div>
  );
}