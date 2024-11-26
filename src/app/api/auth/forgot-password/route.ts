import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    const token = await payload.forgotPassword({
      collection: "users",
      data: { email },
      req: request,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send password reset email" },
      { status: 400 }
    );
  }
}
