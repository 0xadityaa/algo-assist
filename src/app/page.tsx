"use client";
import CodeEditor from "@/components/code-editor";
import { ThemeSelector } from "@/components/theme-selector";
import { useState } from "react";
import { defineTheme } from "@/lib/theme-handler";
import { LanguageSelector } from "@/components/language-selector";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
      <div className="w-full h-screen">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border w-{`95%`}"
        >
          <ResizablePanel defaultSize={30}>
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="font-semibold">Questions</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={85}>
                <div className="flex h-auto w-full items-center justify-center p-6">
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row gap-4 m-2">
                      <ThemeSelector
                        selectedTheme={theme}
                        onThemeChange={handleThemeChange}
                      />
                      <LanguageSelector
                        selectedLanguage={language}
                        onLanguageChange={setLanguage}
                      />
                    </div>
                    <div className="flex-grow w-full">
                      <CodeEditor
                        language={language}
                        code={code || ""}
                        theme={theme}
                        onChange={setCode}
                      />
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={15}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Test cases / Output</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
