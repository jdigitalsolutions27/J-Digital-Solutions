import "dotenv/config";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL || "J-Digital Leads <onboarding@resend.dev>";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM_EMAIL || smtpUser || resendFrom;
const smtpRejectUnauthorized = process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false";

const notifyTo = process.env.NOTIFY_TO_EMAIL;
if (!notifyTo) {
  console.error("Missing NOTIFY_TO_EMAIL in .env.local");
  process.exit(1);
}
const notifyToAddress: string = notifyTo;

const subject = "J-Digital Test: Contact Notification";
const html = `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px">
    <h2>Test Contact Notification</h2>
    <p>This is a test message from your J-Digital contact form pipeline.</p>
    <p><strong>Target inbox:</strong> ${notifyToAddress}</p>
    <p>If you received this, form email notifications are working.</p>
  </div>
`;

async function sendWithResend() {
  if (!resendApiKey) return false;
  const resend = new Resend(resendApiKey);
  const result = await resend.emails.send({
    from: resendFrom,
    to: notifyToAddress,
    subject,
    html
  });

  if ("error" in result && result.error) {
    throw new Error(result.error.message);
  }

  const id = "data" in result ? result.data?.id : undefined;
  console.log(`Resend test sent${id ? ` (id: ${id})` : ""}.`);
  return true;
}

async function sendWithSmtp() {
  if (!smtpHost || !smtpUser || !smtpPass) return false;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    tls: {
      rejectUnauthorized: smtpRejectUnauthorized
    }
  });

  const info = await transporter.sendMail({
    from: smtpFrom,
    to: notifyToAddress,
    subject,
    html
  });

  console.log(`SMTP test sent (messageId: ${info.messageId}).`);
  return true;
}

async function main() {
  try {
    const viaResend = await sendWithResend();
    if (viaResend) return;
  } catch (error) {
    console.error("Resend test failed:", error instanceof Error ? error.message : error);
  }

  try {
    const viaSmtp = await sendWithSmtp();
    if (viaSmtp) return;
  } catch (error) {
    console.error("SMTP test failed:", error instanceof Error ? error.message : error);
  }

  console.error(
    "No working email provider. Configure either RESEND_API_KEY (with verified domain for external recipients) or SMTP_* credentials."
  );
  process.exit(1);
}

main();
