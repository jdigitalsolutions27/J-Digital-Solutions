import Link from "next/link";
import { CalendarClock, ClipboardList, Globe2, Mail, MapPin, MessageCircle, PhoneCall, ShieldCheck } from "lucide-react";

import { GlowBandSeparator } from "@/components/layout/dividers/GlowBandSeparator";
import { PageHero } from "@/components/marketing/page-hero";
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
      "Request a free consultation with J-Digital Solutions and get a clear next-step recommendation for your website, funnel, or growth system.",
    path: "/contact"
  });
}

export const revalidate = 300;

export default async function ContactPage() {
  // Avoid concurrent DB calls (can overwhelm Supabase session pooler under load).
  const settings = await getSiteSettings();
  const packages = await db.pricingPackage.findMany({ orderBy: { position: "asc" } }).catch(() => []);
  const internationalPackages = [
    "Starter Website",
    "Business Website",
    "Professional Website",
    "E-Commerce / Advanced System"
  ];

  const packageOptions =
    packages.length > 0
      ? Array.from(new Set([...packages.map((item) => item.name), ...internationalPackages]))
      : ["Starter", "Basic", "Startup", "Professional", "Business / E-Commerce", ...internationalPackages];

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
        <PageHero
          eyebrow="Contact"
          title="Request a free consultation"
          description="Tell us your goals and we will get back within 24 hours with a clear next-step plan, wherever your business is based."
          signals={[
            { label: "Reply Time", value: "<24 Hours" },
            { label: "Format", value: "Async or Call" },
            { label: "Coverage", value: "Worldwide" }
          ]}
          features={[
            {
              icon: Globe2,
              title: "Global client ready",
              description: "Timezone-friendly communication and remote onboarding built for cross-market projects."
            },
            {
              icon: ClipboardList,
              title: "Clear next steps",
              description: "Every inquiry is reviewed with a practical recommendation, not a generic reply."
            },
            {
              icon: ShieldCheck,
              title: "Structured intake",
              description: "The form collects the details needed to respond with a useful, focused plan."
            }
          ]}
        />
      </SectionWrapper>

      <SectionWrapper variant="raised" glow="soft" withTopDivider>
        <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
          <div className="space-y-5">
            <SectionHeading
              className="mx-0 max-w-none text-left"
              eyebrow="Response Promise"
              title="Structured support with fast response"
              description="We review your request, map your requirements, and recommend the best execution path for your market, scope, and timeline."
            />

            <Card className="border-cyan-300/30 bg-cyan-500/[0.05]">
              <CardContent className="space-y-4 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Choose the Fastest Next Step</p>
                <div className="grid gap-3">
                  {settings.calendarBookingLink ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-start gap-3">
                        <CalendarClock className="mt-0.5 h-5 w-5 text-cyan-200" />
                        <div>
                          <p className="font-semibold text-white">Book a discovery call</p>
                          <p className="mt-1 text-sm text-slate-200">
                            Best if you want to align scope, timeline, and next steps live across your timezone.
                          </p>
                          <Button asChild className="mt-4">
                            <Link href={settings.calendarBookingLink} target="_blank">
                              Open Calendar
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start gap-3">
                      <ClipboardList className="mt-0.5 h-5 w-5 text-cyan-200" />
                      <div>
                        <p className="font-semibold text-white">Send your project brief</p>
                        <p className="mt-1 text-sm text-slate-200">
                          Best if you prefer an async review first. We will reply with a practical recommendation within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-2 p-6 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Direct Contact</p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-200" />
                  {settings.email || "hello@jdigital.solutions"}
                </p>
                <p className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-blue-200" />
                  {settings.phone || "+63 9xx xxx xxxx"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-200" />
                  {settings.officeAddress || "Remote-first | Philippines-based | Serving worldwide"}
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
              <Card className="border-cyan-300/25 bg-cyan-500/[0.04]">
                <CardContent className="p-6">
                  <p className="font-semibold text-white">Need a scheduled discussion with decision-makers?</p>
                  <p className="mt-2 text-sm text-slate-200">
                    Use the calendar if you want to review requirements live, align stakeholders, and lock a realistic execution path quickly.
                  </p>
                  <Button asChild variant="outline" className="mt-4">
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
                  <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">2. We contact you within 24 hours across your preferred channel</li>
                  <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">3. We share a plan, timeline, and recommended next step</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-cyan-300/25 bg-cyan-500/[0.05]">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Global Client Ready</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  <li className="flex items-start gap-3">
                    <Globe2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                    <span>Timezone-friendly communication and practical overlap planning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-cyan-200" />
                    <span>Clear milestone-based delivery with structured approvals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ClipboardList className="mt-0.5 h-4 w-4 text-cyan-200" />
                    <span>Remote onboarding, asset collection, and handover designed for distributed teams</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Project Brief</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Tell us what you need</h2>
                <p className="mt-2 text-sm text-slate-200">
                  Share your goals, market, and preferred working style. We will review your request and recommend the clearest next step.
                </p>
              </CardContent>
            </Card>

            <ContactForm packageOptions={packageOptions} />
          </div>
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
