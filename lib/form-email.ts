export const FORM_EMAIL_TO = "hello@yotravelholic.com";
export const FORM_EMAIL_BCC = "ricky@creativeeyestudios.com";

export type FormEmailPayload = {
  formType:
    | "contact"
    | "collaborate"
    | "cruise-interest"
    | "duck-hunt"
    | "duck-hunt-address";
  [key: string]: unknown;
};

export async function sendFormEmail(payload: FormEmailPayload) {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(data?.error ?? "Unable to send form email.");
  }

  return response.json() as Promise<{ success: true }>;
}

export function buildFallbackMailto(subject: string, body: string) {
  return `mailto:${FORM_EMAIL_TO}?bcc=${encodeURIComponent(FORM_EMAIL_BCC)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}