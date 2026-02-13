"use server";

import bcrypt from "bcryptjs";
import { ProjectStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMissingSupabaseStorageEnvVars, getSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import {
  faqSchema,
  parseList,
  portfolioSchema,
  pricingSchema,
  projectCategorySchema,
  processStepSchema,
  serviceSchema,
  siteSettingsSchema,
  testimonialSchema,
  userPasswordSchema
} from "@/lib/validators";

function nullable(value: string | null | undefined) {
  if (!value || value.trim() === "") return null;
  return value;
}

async function requireAdmin() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    brandName: formData.get("brandName"),
    heroHeadline: formData.get("heroHeadline"),
    heroSubheadline: formData.get("heroSubheadline"),
    primaryCtaLabel: formData.get("primaryCtaLabel"),
    primaryCtaLink: formData.get("primaryCtaLink"),
    secondaryCtaLabel: formData.get("secondaryCtaLabel"),
    secondaryCtaLink: formData.get("secondaryCtaLink"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    officeAddress: formData.get("officeAddress"),
    whatsappLink: formData.get("whatsappLink"),
    messengerLink: formData.get("messengerLink"),
    messageButtonLabel: formData.get("messageButtonLabel"),
    messageButtonLink: formData.get("messageButtonLink"),
    calendarBookingLink: formData.get("calendarBookingLink"),
    facebookUrl: formData.get("facebookUrl"),
    instagramUrl: formData.get("instagramUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
    seoDefaultTitle: formData.get("seoDefaultTitle"),
    seoDefaultDescription: formData.get("seoDefaultDescription"),
    highlightPackageSlug: formData.get("highlightPackageSlug"),
    testimonialsEnabled: formData.get("testimonialsEnabled") === "on"
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid settings payload" };
  }

  await db.siteSettings.upsert({
    where: { id: 1 },
    update: {
      ...parsed.data,
      phone: nullable(parsed.data.phone),
      email: nullable(parsed.data.email),
      officeAddress: nullable(parsed.data.officeAddress),
      whatsappLink: nullable(parsed.data.whatsappLink),
      messengerLink: nullable(parsed.data.messengerLink),
      messageButtonLink: nullable(parsed.data.messageButtonLink),
      calendarBookingLink: nullable(parsed.data.calendarBookingLink),
      facebookUrl: nullable(parsed.data.facebookUrl),
      instagramUrl: nullable(parsed.data.instagramUrl),
      linkedinUrl: nullable(parsed.data.linkedinUrl)
    },
    create: {
      id: 1,
      ...parsed.data,
      phone: nullable(parsed.data.phone),
      email: nullable(parsed.data.email),
      officeAddress: nullable(parsed.data.officeAddress),
      whatsappLink: nullable(parsed.data.whatsappLink),
      messengerLink: nullable(parsed.data.messengerLink),
      messageButtonLink: nullable(parsed.data.messageButtonLink),
      calendarBookingLink: nullable(parsed.data.calendarBookingLink),
      facebookUrl: nullable(parsed.data.facebookUrl),
      instagramUrl: nullable(parsed.data.instagramUrl),
      linkedinUrl: nullable(parsed.data.linkedinUrl)
    }
  });

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/site");

  return { success: "Site settings updated." };
}

export async function saveServiceAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim() || undefined;
  const parsed = serviceSchema.safeParse({
    id,
    title: formData.get("title"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    iconKey: formData.get("iconKey"),
    position: formData.get("position"),
    isActive: formData.get("isActive") === "on"
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid service payload" };
  }

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    shortDescription: parsed.data.shortDescription,
    description: parsed.data.description,
    iconKey: nullable(parsed.data.iconKey),
    position: parsed.data.position,
    isActive: parsed.data.isActive
  };

  if (id) {
    await db.service.update({ where: { id }, data: payload });
  } else {
    await db.service.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");
  return { success: "Service saved." };
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing service ID." };

  await db.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");
  return { success: "Service deleted." };
}

export async function savePortfolioAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim() || undefined;
  const title = String(formData.get("title") || "").trim();
  const providedSlug = String(formData.get("slug") || "").trim();
  const generatedSlug = slugify(title);
  const resolvedSlug = providedSlug || generatedSlug;
  const galleryImagesRaw = formData.get("galleryImages");

  const parsed = portfolioSchema.safeParse({
    id,
    title,
    slug: resolvedSlug,
    industry: formData.get("industry"),
    shortSummary: formData.get("shortSummary"),
    tags: formData.get("tags"),
    coverImage: formData.get("coverImage"),
    servicesProvided: formData.get("servicesProvided"),
    galleryImages: String(galleryImagesRaw || ""),
    liveLink: formData.get("liveLink"),
    status: formData.get("status"),
    position: formData.get("position")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid portfolio payload" };
  }

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug || generatedSlug,
    industry: parsed.data.industry,
    shortSummary: nullable(parsed.data.shortSummary) || `Homepage preview of ${parsed.data.title} for ${parsed.data.industry}.`,
    tags: (() => {
      const values = parseList(parsed.data.tags || "");
      return values.length > 0 ? values : [parsed.data.industry, "Website Homepage"];
    })(),
    coverImage: parsed.data.coverImage,
    servicesProvided: (() => {
      const values = parseList(parsed.data.servicesProvided || "");
      return values.length > 0 ? values : ["Website Design"];
    })(),
    liveLink: nullable(parsed.data.liveLink),
    status: parsed.data.status as ProjectStatus,
    position: parsed.data.position
  };

  const project = id
    ? await db.portfolioProject.update({ where: { id }, data: payload })
    : await db.portfolioProject.create({ data: payload });

  if (galleryImagesRaw !== null) {
    const galleryImages = parseList(parsed.data.galleryImages || "");
    await db.projectImage.deleteMany({ where: { projectId: project.id } });
    if (galleryImages.length > 0) {
      await db.projectImage.createMany({
        data: galleryImages.map((url, index) => ({
          projectId: project.id,
          url,
          position: index + 1
        }))
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
  return { success: "Project saved." };
}

export async function deletePortfolioAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing project ID." };

  await db.portfolioProject.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
  return { success: "Project deleted." };
}

export async function saveProjectCategoryAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim() || undefined;
  const name = String(formData.get("name") || "").trim();
  const providedSlug = String(formData.get("slug") || "").trim();
  const resolvedSlug = providedSlug || slugify(name);

  const parsed = projectCategorySchema.safeParse({
    id,
    name,
    slug: resolvedSlug,
    position: formData.get("position"),
    isActive: formData.get("isActive") === "on"
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid category payload" };
  }

  try {
    if (id) {
      await db.projectCategory.update({
        where: { id },
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug || slugify(parsed.data.name),
          position: parsed.data.position,
          isActive: parsed.data.isActive
        }
      });
    } else {
      await db.projectCategory.create({
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug || slugify(parsed.data.name),
          position: parsed.data.position,
          isActive: parsed.data.isActive
        }
      });
    }
  } catch {
    return { error: "Unable to save category. Name or slug may already exist." };
  }

  revalidatePath("/admin/portfolio");
  return { success: "Project category saved." };
}

export async function deleteProjectCategoryAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) return { error: "Missing category ID." };

  await db.projectCategory.delete({ where: { id } });
  revalidatePath("/admin/portfolio");
  return { success: "Project category deleted." };
}

export async function saveProcessStepAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim() || undefined;
  const parsed = processStepSchema.safeParse({
    id,
    title: formData.get("title"),
    description: formData.get("description"),
    deliverables: formData.get("deliverables"),
    timeline: formData.get("timeline"),
    position: formData.get("position")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid process step payload" };
  }

  const payload = {
    title: parsed.data.title,
    description: parsed.data.description,
    deliverables: parseList(parsed.data.deliverables),
    timeline: parsed.data.timeline,
    position: parsed.data.position
  };

  if (id) {
    await db.processStep.update({ where: { id }, data: payload });
  } else {
    await db.processStep.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/process");
  revalidatePath("/admin/process");
  return { success: "Process step saved." };
}

export async function deleteProcessStepAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing process step ID." };

  await db.processStep.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/process");
  revalidatePath("/admin/process");
  return { success: "Process step deleted." };
}

export async function savePricingAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim() || undefined;
  const parsed = pricingSchema.safeParse({
    id,
    name: formData.get("name"),
    slug: formData.get("slug"),
    price: formData.get("price"),
    delivery: formData.get("delivery"),
    includes: formData.get("includes"),
    freebies: formData.get("freebies"),
    note: formData.get("note"),
    isPopular: formData.get("isPopular") === "on",
    position: formData.get("position")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid pricing payload" };
  }

  const payload = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    price: parsed.data.price,
    delivery: parsed.data.delivery,
    includes: parseList(parsed.data.includes),
    freebies: parseList(parsed.data.freebies),
    note: nullable(parsed.data.note),
    isPopular: parsed.data.isPopular,
    position: parsed.data.position
  };

  if (payload.isPopular) {
    await db.pricingPackage.updateMany({
      where: { id: { not: id } },
      data: { isPopular: false }
    });
  }

  if (id) {
    await db.pricingPackage.update({ where: { id }, data: payload });
  } else {
    await db.pricingPackage.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/admin/pricing");
  return { success: "Pricing package saved." };
}

export async function deletePricingAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing package ID." };

  await db.pricingPackage.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/admin/pricing");
  return { success: "Pricing package deleted." };
}

export async function saveFaqAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim() || undefined;
  const parsed = faqSchema.safeParse({
    id,
    question: formData.get("question"),
    answer: formData.get("answer"),
    position: formData.get("position"),
    isPublished: formData.get("isPublished") === "on"
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid FAQ payload" };
  }

  const payload = {
    question: parsed.data.question,
    answer: parsed.data.answer,
    position: parsed.data.position,
    isPublished: parsed.data.isPublished
  };

  if (id) {
    await db.fAQ.update({ where: { id }, data: payload });
  } else {
    await db.fAQ.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/contact");
  revalidatePath("/admin/faq");
  return { success: "FAQ saved." };
}

export async function deleteFaqAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing FAQ ID." };

  await db.fAQ.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/faq");
  return { success: "FAQ deleted." };
}

export async function saveTestimonialAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim() || undefined;
  const parsed = testimonialSchema.safeParse({
    id,
    name: formData.get("name"),
    role: formData.get("role"),
    company: formData.get("company"),
    quote: formData.get("quote"),
    avatarUrl: formData.get("avatarUrl"),
    position: formData.get("position"),
    isPublished: formData.get("isPublished") === "on"
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid testimonial payload" };
  }

  const payload = {
    name: parsed.data.name,
    role: parsed.data.role,
    company: parsed.data.company,
    quote: parsed.data.quote,
    avatarUrl: nullable(parsed.data.avatarUrl),
    position: parsed.data.position,
    isPublished: parsed.data.isPublished
  };

  if (id) {
    await db.testimonial.update({ where: { id }, data: payload });
  } else {
    await db.testimonial.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/testimonials");
  return { success: "Testimonial saved." };
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing testimonial ID." };

  await db.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: "Testimonial deleted." };
}

export async function saveLeadStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !status) return { error: "Missing lead ID or status." };

  await db.lead.update({
    where: { id },
    data: {
      status: status as "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "LOST"
    }
  });

  revalidatePath("/admin/leads");
  return { success: "Lead status updated." };
}

export async function uploadMediaAction(formData: FormData) {
  const user = await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "Please choose a file." };
  }

  const missingVars = getMissingSupabaseStorageEnvVars();
  if (missingVars.length > 0) {
    return { error: `Missing env vars: ${missingVars.join(", ")}. Add them to .env.local and restart npm run dev.` };
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET as string;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
  const objectPath = `uploads/${Date.now()}-${safeName}`;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true
    });

    if (error) {
      return { error: error.message };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(objectPath);

    await db.mediaAsset.create({
      data: {
        fileName: file.name,
        bucket,
        path: objectPath,
        url: publicUrlData.publicUrl,
        mimeType: file.type,
        size: file.size,
        uploadedById: user.id
      }
    });

    revalidatePath("/admin/media");
    return { success: "File uploaded.", url: publicUrlData.publicUrl };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to upload file"
    };
  }
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing media ID." };

  const media = await db.mediaAsset.findUnique({ where: { id } });
  if (!media) return { error: "Media not found." };

  try {
    const supabase = getSupabaseAdmin();
    await supabase.storage.from(media.bucket).remove([media.path]);
  } catch {
    // Ignore storage delete failures and continue DB cleanup.
  }

  await db.mediaAsset.delete({ where: { id } });
  revalidatePath("/admin/media");
  return { success: "Media deleted." };
}

export async function changePasswordAction(formData: FormData) {
  const user = await requireAdmin();

  const parsed = userPasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid password payload" };
  }

  const current = await db.user.findUnique({ where: { id: user.id } });
  if (!current) return { error: "User not found." };

  const valid = await bcrypt.compare(parsed.data.currentPassword, current.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });

  return { success: "Password updated." };
}

export async function createAdminUserAction(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const name = String(formData.get("name") || "").trim();

  if (!email || !password || password.length < 10) {
    return { error: "Email and a strong password are required." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await db.user.create({
      data: {
        email,
        passwordHash,
        name: name || "Admin"
      }
    });
  } catch {
    return { error: "Unable to create user. Email may already exist." };
  }

  revalidatePath("/admin/users");
  return { success: "Admin user created." };
}
