import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "J-Digital Leads <onboarding@resend.dev>";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFromEmail = process.env.SMTP_FROM_EMAIL || smtpUser || resendFromEmail;
const smtpRejectUnauthorized = process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false";

const smtpTransport =
  smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
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
      })
    : null;

async function sendWithResend({
  to,
  subject,
  html,
  replyTo
}: {
  to: string;
  subject: string;
  html: string;
  replyTo: string;
}) {
  if (!resend) return false;

  const result = await resend.emails.send({
    from: resendFromEmail,
    to,
    subject,
    html,
    replyTo
  });

  if ("error" in result && result.error) {
    throw new Error(result.error.message);
  }

  return true;
}

async function sendWithSmtp({
  to,
  subject,
  html,
  replyTo
}: {
  to: string;
  subject: string;
  html: string;
  replyTo: string;
}) {
  if (!smtpTransport) return false;

  await smtpTransport.sendMail({
    from: smtpFromEmail,
    to,
    subject,
    html,
    replyTo
  });

  return true;
}

async function sendNotification({
  to,
  subject,
  html,
  replyTo
}: {
  to: string;
  subject: string;
  html: string;
  replyTo: string;
}) {
  try {
    const sentWithResend = await sendWithResend({ to, subject, html, replyTo });
    if (sentWithResend) return;
  } catch (error) {
    console.error("Resend delivery failed, trying SMTP fallback:", error);
  }

  const sentWithSmtp = await sendWithSmtp({ to, subject, html, replyTo });
  if (sentWithSmtp) return;

  console.warn("No email provider configured. Set RESEND_API_KEY or SMTP credentials.");
}

export async function sendLeadNotificationEmail(payload: {
  fullName: string;
  email: string;
  mobileNumber: string;
  businessName: string;
  industry: string;
  packageInterest: string;
  budgetRange: string;
  preferredContactMethod: string;
  preferredContactValue?: string;
  messageGoals: string;
}) {
  const to = process.env.NOTIFY_TO_EMAIL;
  if (!to) return;

  const subject = `New Lead: ${payload.fullName} (${payload.packageInterest})`;
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px">
    <h2>New Consultation Inquiry</h2>
    <p><strong>Name:</strong> ${payload.fullName}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Mobile:</strong> ${payload.mobileNumber}</p>
    <p><strong>Business:</strong> ${payload.businessName}</p>
    <p><strong>Industry:</strong> ${payload.industry}</p>
    <p><strong>Package:</strong> ${payload.packageInterest}</p>
    <p><strong>Budget:</strong> ${payload.budgetRange}</p>
    <p><strong>Preferred Contact:</strong> ${payload.preferredContactMethod}</p>
    <p><strong>Preferred Contact Details:</strong> ${payload.preferredContactValue || "Not provided"}</p>
    <p><strong>Message/Goals:</strong></p>
    <p>${payload.messageGoals}</p>
  </div>`;

  await sendNotification({
    to,
    subject,
    html,
    replyTo: payload.email
  });
}

export async function sendAuditLeadNotificationEmail(payload: {
  fullName: string;
  email: string;
  businessName: string;
  websiteOrFacebookLink: string;
}) {
  const to = process.env.NOTIFY_TO_EMAIL;
  if (!to) return;

  const subject = `New Audit Request: ${payload.fullName} (${payload.businessName})`;
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px">
    <h2>New Free Website Audit Request</h2>
    <p><strong>Name:</strong> ${payload.fullName}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Business:</strong> ${payload.businessName}</p>
    <p><strong>Website/Facebook Link:</strong> <a href="${payload.websiteOrFacebookLink}">${payload.websiteOrFacebookLink}</a></p>
  </div>`;

  await sendNotification({
    to,
    subject,
    html,
    replyTo: payload.email
  });
}
