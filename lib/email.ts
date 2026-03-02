import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFromEmail = process.env.SMTP_FROM_EMAIL || smtpUser || "J-Digital Leads <no-reply@jdigital.solutions>";
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
  const sentWithSmtp = await sendWithSmtp({ to, subject, html, replyTo });
  if (sentWithSmtp) return;

  console.warn("No SMTP email provider configured. Set SMTP credentials.");
}

export async function sendLeadNotificationEmail(payload: {
  fullName: string;
  email: string;
  mobileNumber: string;
  businessName: string;
  country?: string;
  timezone?: string;
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
    <p><strong>Country:</strong> ${payload.country || "Not provided"}</p>
    <p><strong>Timezone:</strong> ${payload.timezone || "Not provided"}</p>
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
