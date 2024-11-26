"use client";
import CodeEditor from "@/components/code-editor";
import { ThemeSelector } from "@/components/theme-selector";
import { useState, useEffect } from "react";
import { defineTheme } from "@/lib/theme-handler";
import languages, { LanguageSelector } from "@/components/language-selector";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { getLanguageId } from "@/lib/lang-utils";
import Question from "@/app/questions/two-sum.mdx";
import { MDXProvider } from "@mdx-js/react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from '@/hooks/useAuth';

interface SubmissionResult {
  status: { description: string };
  time: number;
  memory: number;
  stdout?: string | null;
  stderr?: string | null;
}

interface Results {
  submissions: SubmissionResult[];
}

export default function Home() {
  useAuth();

  const [code, setCode] = useState<string>("");
  const [theme, setTheme] = useState<string>("blackboard");
  const [language, setLanguage] = useState<string>(languages[0].value);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [results, setResults] = useState<Results[] | null>(null);

  useEffect(() => {
  const applyTheme = async () => {
    await defineTheme(theme);
  };
  applyTheme();
});

  const handleThemeChange = async (newTheme: string) => {
    if (newTheme) {
      await defineTheme(newTheme);
      setTheme(newTheme);
    } else {
      console.error("Invalid theme selected:", newTheme);
    }
  };

  const handleRunClick = async () => {
    setIsRunning(true);
    console.log("Running code...");
    try {
      console.log("Original Code:", code);
      console.log("Language:", language);

      const languageId = String(getLanguageId(language));

      if (!languageId) {
        throw new Error("Invalid language selected");
      }

      const requestPayload = {
        submissions: [
          {
            "expected_output": "[0,1]",
            "language_id": languageId,
            "source_code": code,
            "stdin": "[2,7,11,15]\n9",
          },
          {
            "expected_output": "[0,1]",
            "language_id": languageId,
            "source_code": code,
            "stdin": "[3,3]\n6",
          },
        ],
      };

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
      setResults(result);

      if (result.submissions) {
        const tokens = result.submissions.map(
          (sub: { token: string }) => sub.token
        );

        await new Promise((resolve) => setTimeout(resolve, 5000));

        const tokenString = tokens.join(',');

        const resultResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-result?tokens=${tokenString}`
        );

        const results = await resultResponse.json();
        console.log("Final Results:", results);
        setResults(results);
        console.log("Updated results state:", results);
      }
    } catch (error) {
      console.error("Error running code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    console.log("Results state updated:", results);
  }, [results]);

  return (
    <div>
      <div className="flex flex-row justify-between items-center m-4">
        <h1 className="text-3xl font-bold m-4">Algo Assist</h1>
        <ModeToggle />
      </div>
      <div className="w-full h-screen">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border w-{`95%`}"
        >
          <ResizablePanel defaultSize={55}>
            <MDXProvider>
              <article className="prose flex flex-col h-screen w-auto items-start justify-start p-6 space-y-4 overflow-y-scroll dark:prose-invert text-lg">
                <Question />
              </article>
            </MDXProvider>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={100} className="overflow-auto w-screen">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel
                defaultSize={85}
                className="overflow-auto w-full"
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
                      disabled={isRunning}
                      className="text-green-600 font-mono font-bold"
                    >
                      RUN
                    </Button>
                  </div>
                  <div className="flex flex-auto overflow-auto w-full p-1">
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
              <ResizablePanel defaultSize={15} suppressHydrationWarning={true}>
                <h2 className="text-xl font-bold m-4">Output</h2>
                    <div className="flex h-full w-auto items-center justify-start overflow-x-auto">
                      {results ? (
                        <div className="flex flex-row overflow-x-auto m-5 space-x-4">
                          {results.map((result: Results, index: number) => (
                            <div key={index} className="border p-4 mb-2 rounded min-w-[300px]">
                              <h3 className="font-bold">Test Case {index + 1}</h3>
                              <p>Status: {result.submissions[0].status.description}</p>
                              <p>Time: {result.submissions[0].time} seconds</p>
                              <p>Memory: {result.submissions[0].memory} KB</p>
                              <p>Expected Output:</p>
                              {result.submissions[0].stdout && (
                                <div>
                                  <h4 className="font-semibold">Output:</h4>
                                  <pre>{Buffer.from(result.submissions[0].stdout, 'base64').toString()}</pre>
                                </div>
                              )}
                              {result.submissions[0].stderr && (
                                <div>
                                  <h4 className="font-semibold text-red-500">Error:</h4>
                                  <pre>{Buffer.from(result.submissions[0].stderr, 'base64').toString()}</pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No results to display.</p>
                      )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
