"use client";
import CodeEditor from "@/components/code-editor";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  return (
    <>
      <h1 className="text-3xl font-bold underline">Algo Assist</h1>
      <CodeEditor language="javascript" code={code || ""} theme={"vs-dark"} onChange={setCode} />
    </>
  );
}
