"use client";
import CodeEditor from "@/components/code-editor";
import { ThemeSelector } from "@/components/theme-selector";
import { useState, useEffect, Key } from "react";
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
import { useAuth } from '@/hooks/useAuth';
import Loading from "@/components/ui/loading";
import { Question } from "@/payload-types";
import { MDXProvider } from "@mdx-js/react";
import { useRouter } from 'next/navigation'; // Import here


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


    useEffect(() => {
        const applyTheme = async () => {
            await defineTheme(theme);
        };
        applyTheme();
    });

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('/api/questions/1');
                if (response.ok) {
                    const data = await response.json();
                    setQuestions([data]);
                    console.log("Fetched question:", data);
                } else {
                    const errorMessage = `Failed to fetch questions: ${response.status}`;
                    console.error(errorMessage);
                    setError(errorMessage);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('An error occurred while fetching questions.');
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await fetch('/api/users/me'); // Updated endpoint
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.user.username); // Access username from user object
                } else if (response.status === 401) {
                    // Handle unauthorized (user not logged in)
                    setUsername(null);
                }
            } catch (error) {
                console.error('Error fetching username:', error);
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
                    ...testCases.map((testCase: { test: string; }) => {
                        try {
                            const parsedTest = JSON.parse(testCase.test);
                            return {
                                "expected_output": parsedTest.expected_output || "",
                                "language_id": languageId,
                                "source_code": code,
                                "stdin": parsedTest.stdin || "",
                            };
                        } catch (error) {
                            console.error("Error parsing test case:", error, testCase.test);
                            return {
                                "expected_output": "",
                                "language_id": languageId,
                                "source_code": code,
                                "stdin": "",
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
            setError('An error occurred while running your code.');
        } finally {
            setIsRunning(false);
        }
    };

    useEffect(() => {
        console.log("Results state updated:", results);
    }, [results]);

    useEffect(() => {
        console.log("Questions state updated:", questions);
    }, [questions]);

    const router = useRouter();
    const {logout} = useAuth();

    const handleLogout = async () => {
        await logout();
        // Then redirect 
        router.push('/auth');
      };

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
                        <MDXProvider>
                            <article className="prose lg:prose-xl flex flex-col h-full w-auto items-start justify-start p-6 space-y-4 overflow-y-scroll dark:prose-invert text-lg">
                                {questions?.[0] && (
                                    <>
                                        <h1>{questions[0].title}</h1>
                                        <div>
                                            {/* Display company */}
                                            {questions[0].companies && questions[0].companies.length > 0 && (
                                                <h4>
                                                    Company: {questions[0].companies.map((company: { name: any; }) => company.name).join(', ')}
                                                </h4>
                                            )}

                                            {/* Display author */}
                                            {questions[0].author && (
                                                <h4>Author: {questions[0].author.username}</h4>
                                            )}

                                            {/* Display tags (topics) */}
                                            {questions[0].topics && questions[0].topics.length > 0 && (
                                                <h4>
                                                    Tags: {questions[0].topics.map((topic: { name: any; }) => topic.name).join(', ')}
                                                </h4>
                                            )}
                                        </div>


                                        {/* Logic to handle different question body structures */}
                                        {questions[0].body && (
                                            <div className="prose-lg">
                                                {/* Handle root/children structure */}
                                                {questions[0].body.root && questions[0].body.root.children && (
                                                    <>
                                                        {questions[0].body.root.children.map((child: { children: any[]; }, index: Key | null | undefined) => {
                                                            if (child.children && child.children.length > 0) {
                                                                return (
                                                                    <p key={index}>
                                                                        {child.children.map((grandChild: { text: any; }) => grandChild.text).join(' ')}
                                                                    </p>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </>
                                                )}

                                                {/* Handle content structure */}
                                                {questions[0].body.content && !questions[0].body.root && (
                                                    <>
                                                        {questions[0].body.content.map((paragraph: { content: any[]; }, index: Key | null | undefined) => (
                                                            <p key={index}>
                                                                {paragraph.content.map((textNode: { text: any; }) => textNode.text).join(' ')}
                                                            </p>
                                                        ))}
                                                    </>
                                                )}

                                                {/* Handle simple string structure */}
                                                {typeof questions[0].body === 'string' && (
                                                    <p>{questions[0].body}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* ... (Rest of your rendering logic) ... */}
                                    </>
                                )}
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
                                    <h2 className="text-xl font-bold m-4">Output <span className="ml-2 text-2xl">📤</span></h2>
                                    <div className="flex h-auto w-auto items-center justify-start overflow-x-auto p-4">
                                        {results ? (
                                            <div className="flex flex-row overflow-x-auto space-x-4">
                                                {questions?.[0]?.tests && results?.map((result, index) => {

                                                    const parsedTest = JSON.parse(questions[0].tests[index].test); // Access parsed test case
                                                    return (
                                                        <div key={index} className="border p-4 mb-2 rounded min-w-[300px]">
                                                            <h3
                                                                className={`font-bold ${result.submissions[0]?.status?.description === 'Accepted' ? 'text-green-500' : 'text-red-500'
                                                                    }`}
                                                            >
                                                                {/* Accessing status from the submissions array within result */}
                                                                Test Case {index + 1}: {result.submissions[0]?.status?.description || 'Status not available'}
                                                                {result.submissions[0]?.status?.description === 'Accepted' ? ' ✅' : ' ❌'}
                                                            </h3>
                                                            <p>Time: {result.submissions[0]?.time || 'N/A'} seconds</p>
                                                            <p>Memory: {result.submissions[0]?.memory || 'N/A'} KB</p>
                                                            <code>Your Output: {Buffer.from(result.submissions[0]?.stdout || '', 'base64').toString()}</code><br />
                                                            <code>Expected Output: {parsedTest.expected_output}</code>
                                                        </div>
                                                    )
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
