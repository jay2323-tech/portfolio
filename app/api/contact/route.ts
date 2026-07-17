import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

export const runtime = "nodejs";

type Body = {
  path?: string;
  name?: string;
  email?: string;
  company?: string;
  message?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const path = body.path === "hiring" || body.path === "project" ? body.path : null;
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const company = (body.company ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!path) {
    return NextResponse.json({ error: "Pick hiring or project." }, { status: 400 });
  }
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Name looks off." }, { status: 400 });
  }
  if (!isEmail(email) || email.length > 200) {
    return NextResponse.json({ error: "Need a valid email." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 4000) {
    return NextResponse.json(
      { error: "Message should be 10–4000 characters." },
      { status: 400 },
    );
  }

  const result = await sendContactEmail({
    path,
    name,
    email,
    company: company || undefined,
    message,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Could not send." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
