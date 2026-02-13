"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { submitAuditLeadAction } from "@/lib/actions/public";
import { fadeUp, shouldReduceMotion, staggerContainer, viewportDefaults } from "@/lib/motion";
import { trackConversionEvent } from "@/lib/tracking";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  businessName: z.string().min(2),
  websiteOrFacebookLink: z.string().url("Please provide a valid website or Facebook URL.")
});

type FormValues = z.infer<typeof schema>;
const DUPLICATE_WINDOW_MS = 30_000;

function SuccessSparkle({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {[...Array(7)].map((_, index) => (
            <motion.span
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200"
              style={{
                left: `${45 + (index - 3) * 6}%`,
                top: `${45 + (index % 2 === 0 ? -6 : 6)}%`
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.7],
                y: [0, -18 - index * 2],
                x: [(index - 3) * 2, (index - 3) * 7]
              }}
              transition={{ duration: 0.75, ease: "easeOut", delay: index * 0.03 }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function AuditLeadForm() {
  const [pending, startTransition] = useTransition();
  const [allowSparkle, setAllowSparkle] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const lastSubmissionRef = useRef<{ key: string; createdAt: number } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setAllowSparkle(mediaQuery.matches && !shouldReduceMotion());

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const onSubmit = (values: FormValues) => {
    const submissionKey = JSON.stringify({
      fullName: values.fullName.trim().toLowerCase(),
      email: values.email.trim().toLowerCase(),
      businessName: values.businessName.trim().toLowerCase(),
      websiteOrFacebookLink: values.websiteOrFacebookLink.trim().toLowerCase()
    });
    const previous = lastSubmissionRef.current;
    if (previous && previous.key === submissionKey && Date.now() - previous.createdAt < DUPLICATE_WINDOW_MS) {
      toast.info("You already sent this audit request. We will contact you shortly.");
      return;
    }

    trackConversionEvent("request_free_audit", { placement: "homepage_audit_form" });
    startTransition(async () => {
      const result = await submitAuditLeadAction(values);
      if (!result.success) {
        toast.error(result.message || "Unable to submit audit request.");
        return;
      }

      toast.success(result.message || "Audit request submitted.");
      lastSubmissionRef.current = { key: submissionKey, createdAt: Date.now() };
      setSubmitted(true);
      if (allowSparkle) {
        setShowSparkle(true);
        window.setTimeout(() => setShowSparkle(false), 880);
      }
      reset();
    });
  };

  return (
    <motion.div
      className="relative"
      initial="hidden"
      whileInView="visible"
      viewport={viewportDefaults}
      variants={fadeUp}
    >
      <SuccessSparkle active={showSparkle} />

      <motion.form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefaults}
      >
        <motion.div className="space-y-2" variants={fadeUp}>
          <Label htmlFor="audit-fullName">Name</Label>
          <Input id="audit-fullName" autoComplete="name" {...register("fullName")} placeholder="Juan Dela Cruz" />
          {errors.fullName ? <p className="text-xs text-red-300">{errors.fullName.message}</p> : null}
        </motion.div>

        <motion.div className="space-y-2" variants={fadeUp}>
          <Label htmlFor="audit-email">Email</Label>
          <Input id="audit-email" type="email" autoComplete="email" {...register("email")} placeholder="you@business.com" />
          {errors.email ? <p className="text-xs text-red-300">{errors.email.message}</p> : null}
        </motion.div>

        <motion.div className="space-y-2" variants={fadeUp}>
          <Label htmlFor="audit-business">Business Name</Label>
          <Input id="audit-business" autoComplete="organization" {...register("businessName")} placeholder="Your Business" />
          {errors.businessName ? <p className="text-xs text-red-300">{errors.businessName.message}</p> : null}
        </motion.div>

        <motion.div className="space-y-2" variants={fadeUp}>
          <Label htmlFor="audit-link">Website or Facebook Link</Label>
          <Input id="audit-link" {...register("websiteOrFacebookLink")} placeholder="https://..." />
          {errors.websiteOrFacebookLink ? <p className="text-xs text-red-300">{errors.websiteOrFacebookLink.message}</p> : null}
        </motion.div>

        <motion.div className="md:col-span-2" variants={fadeUp}>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Submitting..." : "Request Free Audit"}
          </Button>
          <p className="mt-3 text-xs text-slate-300">No spam. We reply within 24 hours.</p>
          {submitted ? (
            <p className="mt-2 text-sm text-emerald-300" role="status" aria-live="polite">
              Audit request received. We will send recommendations within 24 hours.
            </p>
          ) : null}
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
