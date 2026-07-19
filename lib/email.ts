type ContactPayload = {
  path: "hiring" | "project";
  name: string;
  email: string;
  company?: string;
  message: string;
};

/**
 * Send contact form via Resend.
 * Falls back to logging when RESEND_API_KEY is unset (local/dev).
 */
export async function sendContactEmail(
  payload: ContactPayload,
): Promise<{ ok: boolean; error?: string }> {
  const to = process.env.CONTACT_TO_EMAIL || "cvjayanth005@gmail.com";
  const apiKey = process.env.RESEND_API_KEY;
  const subject =
    payload.path === "hiring"
      ? `[Hiring] ${payload.name}${payload.company ? ` — ${payload.company}` : ""}`
      : `[Project] ${payload.name}${payload.company ? ` — ${payload.company}` : ""}`;

  const text = [
    `Path: ${payload.path}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    "",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  if (!apiKey) {
    console.info("[contact] Resend not configured — message logged:", {
      to,
      subject,
      text,
    });
    return { ok: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: payload.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[contact] Resend error", res.status, body);
    return { ok: false, error: "Email provider rejected the message." };
  }

  return { ok: true };
}
