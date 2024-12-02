import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

export async function GET(
  request: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const payload = await getPayload({ config });

    const question = await payload.findByID({
      collection: "questions",
      id: params.questionId,
      depth: 3,
      populate: {
        users: {
          username: true,
        },
        topics: {
          name: true,
        },
        companies: {
          name: true,
        },
        questions: {
          title: true,
          author: true,
          body: true,
          difficulty: true,
          tests: true,
        },
      },
    });
    console.log("Dynamic question:", question);
    return NextResponse.json(question);
  } catch (error: unknown) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: (error as Error)?.message || "Question not found" },
      { status: 404 }
    );
  }
}
