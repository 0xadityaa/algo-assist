// app/api/get-result/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const apiKey = process.env.JUDGE0_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Judge0 API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://judge0-ce.p.sulu.sh/submissions/${token}?base64_encoded=true`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
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

    // Decode base64 outputs if they exist
    if (result.stdout) {
      result.stdout = Buffer.from(result.stdout, "base64").toString();
    }
    if (result.stderr) {
      result.stderr = Buffer.from(result.stderr, "base64").toString();
    }
    if (result.compile_output) {
      result.compile_output = Buffer.from(
        result.compile_output,
        "base64"
      ).toString();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
