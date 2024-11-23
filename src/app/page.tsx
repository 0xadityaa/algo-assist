"use client";
import CodeEditor from "@/components/code-editor";
import { ThemeSelector } from "@/components/theme-selector";
import { useState } from "react";
import { defineTheme } from "@/lib/theme-handler";
import languages, { LanguageSelector } from "@/components/language-selector";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { getLanguageId } from "@/lib/lang-utils";

export default function Home() {
  const [code, setCode] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState(languages[0].value);

  const handleThemeChange = async (newTheme: string) => {
    if (newTheme) {
      await defineTheme(newTheme);
    }
    setTheme(newTheme);
  };

  const handleRunClick = async () => {
    console.log("Running code...");
    try {
      // First, log what we're about to send
      console.log("Original Code:", code);
      console.log("Language:", language);

      // Convert language ID to string and validate
      const languageId = String(getLanguageId(language));

      if (!languageId) {
        throw new Error("Invalid language selected");
      }

      // Create the request body exactly as Judge0 expects
      const requestPayload = {
        submissions: [
          {
            expected_output: "hello wrld",
            language_id: languageId,
            source_code: code,
            stdin: "wrld",
          },
          {
            expected_output: "hello ",
            language_id: languageId,
            source_code: code,
            stdin: "",
          },
        ],
      };

      // Log the actual payload being sent
      console.log("Sending payload:", requestPayload);

      const response = await fetch("/api/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Network response was not ok");
      }

      const result = await response.json();
      console.log("Submission Result:", result);

      // Get the final results using the tokens
      if (result.submissions) {
        const tokens = result.submissions.map(
          (sub: { token: unknown }) => sub.token
        );

        // Wait a bit for Judge0 to process
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Join tokens into a single string
        const tokenString = tokens.join(',');

        // Fetch results using the token string
        const resultResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-result?tokens=${tokenString}`
        );

        // Parse the response
        const results = await resultResponse.json();

        console.log("Final Results:", results);
      }
    } catch (error) {
      console.error("Error running code:", error);
    }
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
          <ResizablePanel defaultSize={100} className="overflow-auto w-screen">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel
                defaultSize={85}
                className="overflow-auto w-screen"
              >
                <div className="flex flex-col h-full w-full">
                  <div className="flex flex-row gap-4 m-2">
                    <ThemeSelector
                      selectedTheme={theme}
                      onThemeChange={handleThemeChange}
                    />
                    <LanguageSelector
                      selectedLanguage={language}
                      onLanguageChange={setLanguage}
                    />
                    <Button
                      value={"Run"}
                      variant={"outline"}
                      onClick={handleRunClick}
                    >
                      {" "}
                      Run{" "}
                    </Button>
                  </div>
                  <div className="flex flex-auto overflow-auto w-full">
                    <CodeEditor
                      language={language}
                      code={code}
                      theme={theme}
                      setCode={setCode}
                    />
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
