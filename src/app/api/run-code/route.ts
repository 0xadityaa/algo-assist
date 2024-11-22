import { NextResponse } from "next/server";

interface Submission {
  expected_output: string;
  language_id: string;
  source_code: string;
  stdin: string;
}

interface RequestBody {
  submissions: Submission[];
}

export async function POST(request: Request) {
  try {
    const requestBody = (await request.json()) as RequestBody;
    console.log("Received request body:", requestBody);

    // Validate the request structure
    if (!requestBody.submissions || !Array.isArray(requestBody.submissions)) {
      return NextResponse.json(
        { error: "Invalid request structure. Expected 'submissions' array." },
        { status: 400 }
      );
    }

    const apiKey = process.env.JUDGE0_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Judge0 API key not configured" },
        { status: 500 }
      );
    }

    // Prepare submissions with proper base64 encoding
    const judgeSubmissions = requestBody.submissions.map((submission) => ({
      language_id: submission.language_id,
      // Properly encode the source code
      source_code: Buffer.from(submission.source_code).toString("base64"),
      stdin: Buffer.from(submission.stdin).toString("base64"),
      expected_output: Buffer.from(submission.expected_output),
    }));

    console.log("Prepared Judge0 submissions:", judgeSubmissions);

    const response = await fetch(
      "https://judge0-ce.p.sulu.sh/submissions/batch?base64_encoded=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ submissions: judgeSubmissions }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Judge0 API error:", errorText);
      return NextResponse.json(
        { error: "Judge0 API error", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("Judge0 response:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}