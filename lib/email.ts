import { Resend } from "resend";
import { CONTACT } from "@/lib/constants";

type ContactNotificationData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  date?: string | null;
  message: string;
  items?: string | null;
  supplies?: string | null;
};

const SERVICE_LABELS: Record<string, string> = {
  moving: "Moving Services",
  "junk-removal": "Junk Removal",
  both: "Both (Moving + Junk Removal)",
  other: "Other",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactNotification(data: ContactNotificationData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping notification email");
    return;
  }

  const resend = new Resend(apiKey);
  const to = process.env.NOTIFICATION_EMAIL || CONTACT.email;
  const from =
    process.env.NOTIFICATION_FROM ||
    "Finn's Family Moving <onboarding@resend.dev>";

  const serviceLabel = SERVICE_LABELS[data.service] || data.service;

  const fields: Array<[string, string]> = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Service", serviceLabel],
  ];
  if (data.date) fields.push(["Preferred date", data.date]);
  if (data.items) fields.push(["Items", data.items]);
  if (data.supplies) fields.push(["Supplies", data.supplies]);

  const rowsHtml = fields
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 8px 12px 8px 0; color: #6b6b6b; font-weight: 500; vertical-align: top; width: 120px;">${escapeHtml(label)}</td>
          <td style="padding: 8px 0; color: #1a1a1a;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: #dd5f08; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 600;">New Quote Request</h1>
        <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">${escapeHtml(data.name)} — ${escapeHtml(serviceLabel)}</p>
      </div>
      <div style="background: #fafafa; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #eaeaea; border-top: none;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">${rowsHtml}</table>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eaeaea;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #6b6b6b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em;">Message</p>
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(data.message)}</p>
        </div>
        <p style="margin: 24px 0 0; font-size: 12px; color: #999;">Reply to this email to respond directly to ${escapeHtml(data.name)}.</p>
      </div>
    </div>
  `;

  const textLines = [
    `New Quote Request from ${data.name}`,
    "",
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    data.message,
  ];

  await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `New quote request from ${data.name}`,
    html,
    text: textLines.join("\n"),
  });
}
