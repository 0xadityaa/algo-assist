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
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";
import { Question } from "@/payload-types";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

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
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const params = useParams();
  const questionId = params.id;

  useEffect(() => {
    const applyTheme = async () => {
      await defineTheme(theme);
    };
    applyTheme();
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!questionId) return;
      try {
        // Fetch a single question by ID
        const response = await fetch(`/api/questions?questionId=${questionId}`); // Assuming you have a dynamic route for questions
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched question data:", data);
          setQuestions(data); // Wrap the single question in an array
        } else {
          const errorMessage = `Failed to fetch questions: ${response.status}`;
          console.error(errorMessage);
          setError(errorMessage);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("An error occurred while fetching questions.");
      }
    };

    fetchQuestions();
  }, [questionId]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch("/api/users/me"); // Updated endpoint
        if (response.ok) {
          const data = await response.json();
          setUsername(data.user.username); // Access username from user object
        } else if (response.status === 401) {
          // Handle unauthorized (user not logged in)
          setUsername(null);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, [username]);

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

      const testCases = questions?.[0]?.tests || [];

      const requestPayload = {
        submissions: [
          ...testCases.map((testCase) => {
            try {
              const parsedTest = JSON.parse(testCase.test as string);
              return {
                expected_output: parsedTest.expected_output || "",
                language_id: languageId,
                source_code: code,
                stdin: parsedTest.stdin || "",
              };
            } catch (error) {
              console.error("Error parsing test case:", error, testCase.test);
              return {
                expected_output: "",
                language_id: languageId,
                source_code: code,
                stdin: "",
              };
            }
          }),
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

        const tokenString = tokens.join(",");

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
      setError("An error occurred while running your code.");
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    console.log("Results state updated:", results);
  }, [results]);

  useEffect(() => {
    console.log("Questions state updated:", questions);
    setQuestions(questions);
  }, [questions]);

  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Then redirect
    router.push("/auth");
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!questions) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-row justify-between items-center m-4">
        <h1 className="text-3xl font-bold m-4">Algo Assist</h1>
        {username && (
          <div className="flex items-center space-x-2">
            <span className="mt-1 text-md">👋</span>
            <span className="text-md font-mono">{username}</span>
            <Button
              onClick={async () => {
                await handleLogout();
              }}
              value={"Log Out"}
              variant={"outline"}
              className="font-bold w-50 h-50"
            >
              Logout
            </Button>
          </div>
        )}
        <ModeToggle />
      </div>
      <div className="w-full h-screen">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border w-{`95%`}"
        >
          <ResizablePanel defaultSize={55}>
            {questions && questions.length > 0 && (
              <article className="w-auto m-4 space-y-6 p-2 overflow-y-scroll">
                <h2 className="text-2xl font-bold">{questions[0].title}</h2>
                <b>Difficulty:</b> <Badge variant={"default"}>
                  {questions[0].difficulty?.toLocaleLowerCase()}
                </Badge><br/>
                <>
                  <b>Topics:{" "}</b>
                  {questions[0].topics?.map((topic) => (
                    <Badge key={topic.id} variant={"secondary"}>
                      {topic.name.toLocaleLowerCase()}
                    </Badge>
                  ))}
                </><br/>
                <>
                <b>Companies:{" "}</b>
                {questions[0].companies?.map((company) => (
                  <Badge key={company.id} variant={"outline"}>
                    {company.name.toLocaleLowerCase()}
                  </Badge>
                ))}
                </><br/><br/>
                <div dangerouslySetInnerHTML={{ __html: questions[0].body_html }} />
              </article>
            )}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={100} className="overflow-auto w-screen">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={85} className="overflow-auto w-full">
                <div className="flex flex-col h-full w-full">
                  <div className="flex flex-row gap-2 m-2">
                    <span className="mt-1 text-xl">🎨</span>
                    <ThemeSelector
                      selectedTheme={theme}
                      onThemeChange={handleThemeChange}
                    />
                    <span className="mt-1 text-xl">⚙️</span>
                    <LanguageSelector
                      selectedLanguage={language}
                      onLanguageChange={setLanguage}
                    />

                    <span className="mt-1 text-xl">⚡</span>
                    <Button
                      value={"Run"}
                      variant={"outline"}
                      onClick={handleRunClick}
                      disabled={isRunning}
                      className="text-green-600 font-mono font-bold w-full"
                    >
                      RUN
                    </Button>

                    <span className="mt-1 text-xl">🚀</span>
                    <Button
                      value={"Submit"}
                      variant={"default"}
                      // onClick={handleRunClick}
                      // disabled={isRunning}
                      className="text-green-600 font-mono font-bold w-full"
                    >
                      SUBMIT
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
                <div className="h-full overflow-y-auto">
                  <h2 className="text-xl font-bold m-4">
                    Output <span className="ml-2 text-2xl">📤</span>
                  </h2>
                  <div className="flex h-auto w-auto items-center justify-start overflow-x-auto p-4">
                    {results ? (
                      <div className="flex flex-row overflow-x-auto space-x-4">
                        {questions?.[0]?.tests &&
                          results?.map((result, index) => {
                            const parsedTest = JSON.parse(
                              questions[0].tests[index].test
                            ); // Access parsed test case
                            return (
                              <div
                                key={index}
                                className="border p-4 mb-2 rounded min-w-[300px]"
                              >
                                <h3
                                  className={`font-bold ${
                                    result.submissions[0]?.status
                                      ?.description === "Accepted"
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {/* Accessing status from the submissions array within result */}
                                  Test Case {index + 1}:{" "}
                                  {result.submissions[0]?.status?.description ||
                                    "Status not available"}
                                  {result.submissions[0]?.status
                                    ?.description === "Accepted"
                                    ? " ✅"
                                    : " ❌"}
                                </h3>
                                <p>
                                  Time: {result.submissions[0]?.time || "N/A"}{" "}
                                  seconds
                                </p>
                                <p>
                                  Memory:{" "}
                                  {result.submissions[0]?.memory || "N/A"} KB
                                </p>
                                <code>
                                  Your Output:{" "}
                                  {Buffer.from(
                                    result.submissions[0]?.stdout || "",
                                    "base64"
                                  ).toString()}
                                </code>
                                <br />
                                <code>
                                  Expected Output: {parsedTest.expected_output}
                                </code>
                              </div>
                            );
                          })}
                      </div>
                    ) : isRunning ? (
                      <Loading />
                    ) : (
                      <p className="m-4">No results to display.</p>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
