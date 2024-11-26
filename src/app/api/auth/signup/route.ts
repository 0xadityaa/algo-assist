import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

export async function POST(request: NextRequest) {
  const { username, email, password } = await request.json();

  try {
    const result = await payload.create({
      collection: "users",
      data: { username, email, password },
      req: request,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Signup failed" }, { status: 400 });
  }
}
