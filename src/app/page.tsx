"use client";
import CodeEditor from "@/components/code-editor";
import { ThemeSelector } from "@/components/theme-selector";
import { useState } from "react";
import { defineTheme } from "@/lib/theme-handler";
import { LanguageSelector } from "@/components/language-selector";

export default function Home() {
  const [code, setCode] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("javascript");

  const handleThemeChange = async (newTheme: string) => {
    if (newTheme) {
      await defineTheme(newTheme);
    }
    setTheme(newTheme);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold m-4">Algo Assist</h1>
      <div>
        <div className="flex flex-row gap-4 m-4">
        <ThemeSelector selectedTheme={theme} onThemeChange={handleThemeChange} />
        <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />
      </div>
      <CodeEditor language={language} code={code || ""} theme={theme} onChange={setCode} />
      </div>
    </div>
  );
}
