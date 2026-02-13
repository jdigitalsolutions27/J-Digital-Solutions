"use server";

import { headers } from "next/headers";

import { db } from "@/lib/db";
import { sendAuditLeadNotificationEmail, sendLeadNotificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { auditLeadSchema, leadSchema } from "@/lib/validators";

export async function submitLeadAction(input: unknown) {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please complete all required fields.",
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const hdr = headers();
  const forwardedFor = hdr.get("x-forwarded-for") || "unknown";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";

  const rate = checkRateLimit(ip, 5, 60 * 1000);
  if (!rate.allowed) {
    return {
      success: false,
      message: "Too many submissions. Please try again in a minute."
    };
  }

  const lead = await db.lead.create({
    data: {
      ...parsed.data,
      leadType: "CONSULTATION"
    }
  });

  try {
    await sendLeadNotificationEmail(parsed.data);
  } catch (error) {
    console.error("Failed to send consultation lead notification email:", error);
  }

  return {
    success: true,
    message: "We received your inquiry. We will respond within 24 hours.",
    leadId: lead.id
  };
}

export async function submitAuditLeadAction(input: unknown) {
  const parsed = auditLeadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please complete all required fields.",
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const hdr = headers();
  const forwardedFor = hdr.get("x-forwarded-for") || "unknown";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";

  const rate = checkRateLimit(`${ip}-audit`, 3, 60 * 1000);
  if (!rate.allowed) {
    return {
      success: false,
      message: "Too many submissions. Please try again in a minute."
    };
  }

  const lead = await db.lead.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      businessName: parsed.data.businessName,
      websiteOrFacebookLink: parsed.data.websiteOrFacebookLink,
      mobileNumber: "N/A",
      industry: "N/A",
      packageInterest: "Audit",
      budgetRange: "N/A",
      preferredContactMethod: "Email",
      preferredContactValue: parsed.data.email,
      messageGoals: "Requested free website audit.",
      leadType: "AUDIT"
    }
  });

  try {
    await sendAuditLeadNotificationEmail(parsed.data);
  } catch (error) {
    console.error("Failed to send audit lead notification email:", error);
  }

  return {
    success: true,
    message: "Audit request received. We will reply within 24 hours.",
    leadId: lead.id
  };
}
