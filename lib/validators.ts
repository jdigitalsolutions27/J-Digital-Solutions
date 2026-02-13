import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const siteSettingsSchema = z.object({
  brandName: z.string().min(2),
  heroHeadline: z.string().min(10),
  heroSubheadline: z.string().min(20),
  primaryCtaLabel: z.string().min(2),
  primaryCtaLink: z.string().min(1),
  secondaryCtaLabel: z.string().min(2),
  secondaryCtaLink: z.string().min(1),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  officeAddress: z.string().optional().or(z.literal("")),
  whatsappLink: z.string().url().optional().or(z.literal("")),
  messengerLink: z.string().url().optional().or(z.literal("")),
  messageButtonLabel: z.string().min(2),
  messageButtonLink: z.string().url().optional().or(z.literal("")),
  calendarBookingLink: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  seoDefaultTitle: z.string().min(10),
  seoDefaultDescription: z.string().min(20),
  highlightPackageSlug: z.string().min(1),
  testimonialsEnabled: z.boolean()
});

export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  slug: z.string().min(3),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  iconKey: z.string().optional().or(z.literal("")),
  position: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true)
});

export const portfolioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().optional().or(z.literal("")),
  industry: z.string().min(2),
  shortSummary: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  coverImage: z.string().min(1),
  servicesProvided: z.string().optional().or(z.literal("")),
  galleryImages: z.string().optional().or(z.literal("")),
  liveLink: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DEMO", "CLIENT"]),
  position: z.coerce.number().int().min(0)
});

export const projectCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().optional().or(z.literal("")),
  position: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true)
});

export const processStepSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  description: z.string().min(10),
  deliverables: z.string().min(1),
  timeline: z.string().min(2),
  position: z.coerce.number().int().min(0)
});

export const pricingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  price: z.coerce.number().int().min(0),
  delivery: z.string().min(2),
  includes: z.string().min(1),
  freebies: z.string().min(1),
  note: z.string().optional().or(z.literal("")),
  isPopular: z.boolean().default(false),
  position: z.coerce.number().int().min(0)
});

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(5),
  answer: z.string().min(10),
  position: z.coerce.number().int().min(0),
  isPublished: z.boolean().default(true)
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  role: z.string().min(2),
  company: z.string().min(2),
  quote: z.string().min(10),
  avatarUrl: z.string().optional().or(z.literal("")),
  position: z.coerce.number().int().min(0),
  isPublished: z.boolean().default(true)
});

export const leadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  mobileNumber: z.string().min(8),
  businessName: z.string().min(2),
  industry: z.string().min(2),
  packageInterest: z.string().min(2),
  budgetRange: z.string().min(2),
  preferredContactMethod: z.string().min(2),
  preferredContactValue: z.string().optional().or(z.literal("")),
  messageGoals: z.string().min(1, "Please enter your message or goals.")
});

export const auditLeadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  businessName: z.string().min(2),
  websiteOrFacebookLink: z.string().url("Please provide a valid website or Facebook link.")
});

export const userPasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(10),
    confirmPassword: z.string().min(10)
  })
  .refine((val) => val.newPassword === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export function parseList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
