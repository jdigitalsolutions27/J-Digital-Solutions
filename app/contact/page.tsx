import Link from "next/link";
import { CalendarClock, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";

import { GlowBandSeparator } from "@/components/layout/dividers/GlowBandSeparator";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { ContactForm } from "@/components/marketing/contact-form";
import { MarketingShell } from "@/components/marketing/shell";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-data";
import { typography } from "@/lib/typography";

export async function generateMetadata() {
  return buildMetadata({
    title: "Contact | J-Digital Solutions",
    description:
      "Request a free consultation with J-Digital Solutions. Tell us about your business goals and website requirements.",
    path: "/contact"
  });
}

export default async function ContactPage() {
  // Avoid concurrent DB calls (can overwhelm Supabase session pooler under load).
  const settings = await getSiteSettings();
  const packages = await db.pricingPackage.findMany({ orderBy: { position: "asc" } }).catch(() => []);

  const packageOptions =
    packages.length > 0
      ? packages.map((item) => item.name)
      : ["Starter", "Basic", "Startup", "Professional", "Business / E-Commerce"];

  const contactButtons = [
    settings.messageButtonLink
      ? {
          label: "Messenger",
          href: settings.messageButtonLink,
          icon: MessageCircle
        }
      : null,
    settings.whatsappLink
      ? {
          label: "WhatsApp",
          href: settings.whatsappLink,
          icon: MessageCircle
        }
      : null,
    settings.email
      ? {
          label: "Email",
          href: `mailto:${settings.email}`,
          icon: Mail
        }
      : null,
    settings.phone
      ? {
          label: "Call",
          href: `tel:${settings.phone}`,
          icon: PhoneCall
        }
      : null
  ].filter(Boolean) as Array<{ label: string; href: string; icon: typeof Mail }>;

  return (
    <MarketingShell>
      <SectionWrapper variant="accent" glow="hero" withBottomDivider>
        <p className={typography.eyebrow}>Contact</p>
        <h1 className={`mt-3 ${typography.heroTitle}`}>Request a free consultation</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Tell us your goals and we will get back within 24 hours with a clear next-step plan.
        </p>
      </SectionWrapper>

      <SectionWrapper variant="raised" glow="soft" withTopDivider>
        <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
          <div className="space-y-5">
            <SectionHeading
              className="mx-0 max-w-none text-left"
              eyebrow="Response Promise"
              title="Structured support with fast response"
              description="We review your request, map your requirements, and recommend the best execution path."
            />

            <Card>
              <CardContent className="space-y-2 p-6 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Direct Contact</p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-200" />
                  {settings.email || "hello@jdigital.ph"}
                </p>
                <p className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-blue-200" />
                  {settings.phone || "+63 9xx xxx xxxx"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-200" />
                  {settings.officeAddress || "Philippines"}
                </p>
              </CardContent>
            </Card>

            {contactButtons.length > 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Preferred Contact Method</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {contactButtons.map((button) => (
                      <Button key={button.label} asChild variant="outline" className="justify-start">
                        <Link href={button.href} target="_blank">
                          <button.icon className="mr-2 h-4 w-4" /> {button.label}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {settings.calendarBookingLink ? (
              <Card className="border-cyan-300/30 bg-cyan-500/[0.05]">
                <CardContent className="p-6">
                  <p className="font-semibold text-white">Prefer a scheduled call?</p>
                  <p className="mt-2 text-sm text-slate-200">Book a slot directly and skip the back-and-forth.</p>
                  <Button asChild className="mt-4">
                    <Link href={settings.calendarBookingLink} target="_blank">
                      <CalendarClock className="mr-2 h-4 w-4" /> Open Calendar
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">What Happens After You Submit</p>
                <ol className="mt-4 space-y-3 text-sm text-slate-200">
                  <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">1. We review your request</li>
                  <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">2. We contact you within 24 hours</li>
                  <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">3. We share a plan + timeline</li>
                </ol>
              </CardContent>
            </Card>
          </div>

          <ContactForm packageOptions={packageOptions} />
        </div>
      </SectionWrapper>

      <GlowBandSeparator />

      <SectionWrapper variant="accent" glow="hero" withTopDivider withBottomDivider>
        <Card className="border-cyan-300/30 bg-slate-900/60">
          <CardContent className="p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to discuss your project?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200">
              Share your goals today and get a practical recommendation in under 24 hours.
            </p>
            <Button asChild size="lg" className="mt-5">
              <Link href="/contact?package=startup">Submit Project Details</Link>
            </Button>
          </CardContent>
        </Card>
      </SectionWrapper>
    </MarketingShell>
  );
}
