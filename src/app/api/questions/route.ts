import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";// Import the Questions type

export async function GET() {
  try {
    const payload = await getPayload({ config });

    const { docs: questions } = await payload.find({
      collection: "questions",
      depth: 3,
      populate: {
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

        }
      },
    });
    console.log(JSON.stringify(questions));
    return NextResponse.json(questions);
  } catch (error: unknown) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: (error as Error)?.message || "An error occurred while fetching questions." },
      { status: 500 }
    );
  }
}
