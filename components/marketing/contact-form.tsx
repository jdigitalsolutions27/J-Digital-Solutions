"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { submitLeadAction } from "@/lib/actions/public";
import { budgetRanges, contactMethods, industryOptions } from "@/lib/constants";
import { leadSchema } from "@/lib/validators";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormValues = z.infer<typeof leadSchema>;
const DUPLICATE_WINDOW_MS = 30_000;

export function ContactForm({ packageOptions }: { packageOptions: string[] }) {
  const searchParams = useSearchParams();
  const packageFromQuery = searchParams.get("package");

  const defaultPackage = useMemo(() => {
    if (!packageFromQuery) return packageOptions[0] || "Startup";
    const match = packageOptions.find((pkg) => pkg.toLowerCase() === packageFromQuery.toLowerCase());
    return match || packageOptions[0] || "Startup";
  }, [packageFromQuery, packageOptions]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      packageInterest: defaultPackage,
      preferredContactMethod: "Email",
      preferredContactValue: "",
      budgetRange: budgetRanges[1]
    }
  });

  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const lastSubmissionRef = useRef<{ key: string; createdAt: number } | null>(null);

  useEffect(() => {
    setValue("packageInterest", defaultPackage);
  }, [defaultPackage, setValue]);

  const preferredContactMethod = watch("preferredContactMethod");
  const preferredContactMeta = useMemo(() => {
    const method = preferredContactMethod || "Email";
    if (method === "Phone Call") {
      return {
        label: "Preferred Phone Number",
        placeholder: "Enter the number we should call."
      };
    }
    if (method === "Messenger") {
      return {
        label: "Messenger Profile or Link",
        placeholder: "Paste your Messenger profile link or username."
      };
    }
    if (method === "WhatsApp") {
      return {
        label: "WhatsApp Number",
        placeholder: "Enter your WhatsApp number with country code."
      };
    }
    if (method === "Viber") {
      return {
        label: "Viber Number",
        placeholder: "Enter your Viber number with country code."
      };
    }
    return {
      label: "Preferred Contact Details",
      placeholder: "Share where we should contact you."
    };
  }, [preferredContactMethod]);

  const buildSubmissionKey = (values: FormValues) =>
    JSON.stringify({
      fullName: values.fullName.trim().toLowerCase(),
      email: values.email.trim().toLowerCase(),
      mobileNumber: values.mobileNumber.trim(),
      businessName: values.businessName.trim().toLowerCase(),
      industry: values.industry.trim().toLowerCase(),
      packageInterest: values.packageInterest.trim().toLowerCase(),
      budgetRange: values.budgetRange.trim().toLowerCase(),
      preferredContactMethod: values.preferredContactMethod.trim().toLowerCase(),
      preferredContactValue: (values.preferredContactValue ?? "").trim().toLowerCase(),
      messageGoals: values.messageGoals.trim().toLowerCase()
    });

  const onSubmit = (values: FormValues) => {
    const submissionKey = buildSubmissionKey(values);
    const previous = lastSubmissionRef.current;
    if (previous && previous.key === submissionKey && Date.now() - previous.createdAt < DUPLICATE_WINDOW_MS) {
      toast.info("You already submitted this request. Please wait while we review it.");
      return;
    }

    startTransition(async () => {
      const result = await submitLeadAction(values);
      if (!result.success) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            const message = messages?.[0];
            if (message) {
              setError(field as keyof FormValues, { type: "server", message });
            }
          }
        }
        toast.error(result.message || "Unable to submit form");
        return;
      }

      lastSubmissionRef.current = { key: submissionKey, createdAt: Date.now() };
      toast.success(result.message || "Submitted");
      setSubmitted(true);
      reset({
        fullName: "",
        email: "",
        mobileNumber: "",
        businessName: "",
        industry: "",
        packageInterest: defaultPackage,
        budgetRange: budgetRanges[1],
        preferredContactMethod: "Email",
        preferredContactValue: "",
        messageGoals: ""
      });
    });
  };

  return (
    <div className="surface p-6 sm:p-8">
      <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} aria-busy={pending} noValidate>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" autoComplete="name" {...register("fullName")} />
          {errors.fullName ? <p className="text-xs text-red-300">{errors.fullName.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email ? <p className="text-xs text-red-300">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input id="mobileNumber" autoComplete="tel" {...register("mobileNumber")} />
          {errors.mobileNumber ? <p className="text-xs text-red-300">{errors.mobileNumber.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input id="businessName" autoComplete="organization" {...register("businessName")} />
          {errors.businessName ? <p className="text-xs text-red-300">{errors.businessName.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select id="industry" {...register("industry")}>
            <option value="">Select industry</option>
            {industryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          {errors.industry ? <p className="text-xs text-red-300">{errors.industry.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="packageInterest">Package Interest</Label>
          <Select id="packageInterest" {...register("packageInterest")}>
            {packageOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetRange">Budget Range</Label>
          <Select id="budgetRange" {...register("budgetRange")}>
            {budgetRanges.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
          <Select id="preferredContactMethod" {...register("preferredContactMethod")}>
            {contactMethods.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredContactValue">
            {preferredContactMeta.label} <span className="text-slate-400">(optional)</span>
          </Label>
          <Input id="preferredContactValue" {...register("preferredContactValue")} placeholder={preferredContactMeta.placeholder} />
          {errors.preferredContactValue ? <p className="text-xs text-red-300">{errors.preferredContactValue.message}</p> : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="messageGoals">Message / Goals</Label>
          <Textarea id="messageGoals" rows={5} {...register("messageGoals")} placeholder="Tell us your goals, timeline, and what you need help with." />
          {errors.messageGoals ? <p className="text-xs text-red-300">{errors.messageGoals.message}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
            {pending ? "Submitting..." : "Request Free Consultation"}
          </Button>
          <p className="mt-3 text-xs text-slate-300">No spam. Your details stay private.</p>
          <p className="mt-1 text-xs text-slate-300">Typical response time: within 24 hours.</p>
          {submitted ? (
            <p className="mt-3 text-sm text-emerald-300" role="status" aria-live="polite">
              We will respond within 24 hours. Your request is now in our review queue.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
