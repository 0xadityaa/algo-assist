import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const result = await payload.login({
      collection: "users",
      data: { email, password },
      req: request,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 401 });
  }
}
