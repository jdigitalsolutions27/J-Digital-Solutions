import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, Layers3, Sparkles, Target } from "lucide-react";

import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SoftWaveSeparator } from "@/components/layout/dividers/SoftWaveSeparator";
import { PortfolioImageLightbox } from "@/components/marketing/portfolio-image-lightbox";
import { MarketingShell } from "@/components/marketing/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/metadata";
import { typography } from "@/lib/typography";

type IndustryProfile = {
  outcome: string;
  challenge: string;
  strategy: string;
  commercialFocus: string[];
  engagementFit: string;
};

function normalizeIndustry(industry: string) {
  if (industry.toLowerCase() === "ecommerce" || industry.toLowerCase() === "e-commerce") {
    return "E-Commerce";
  }
  return industry;
}

function getIndustryProfile(industry: string): IndustryProfile {
  const profiles: Record<string, IndustryProfile> = {
    Construction: {
      outcome: "Stronger trust positioning and improved quality of contractor inquiries.",
      challenge:
        "Construction buyers usually evaluate credibility fast. The site needed to communicate capability, project confidence, and service clarity before a prospect ever requested a quote.",
      strategy:
        "We structured the build around authority signals, disciplined service presentation, and direct inquiry paths so the business could look established and easier to trust at first glance.",
      commercialFocus: ["Service clarity", "Proof-led messaging", "Quote-ready CTAs"],
      engagementFit: "Ideal for firms that need to look more established, premium, and organized before sales conversations begin."
    },
    Healthcare: {
      outcome: "Cleaner mobile patient journey and better first-contact confidence.",
      challenge:
        "Healthcare visitors need clarity, reassurance, and a low-friction path to inquiry. Weak structure or generic design tends to reduce trust quickly on mobile.",
      strategy:
        "The experience was framed around trust-first messaging, easier navigation, and cleaner inquiry routes so prospective patients or clients could understand services and take action with less hesitation.",
      commercialFocus: ["Patient confidence", "Mobile usability", "Clear inquiry flow"],
      engagementFit: "Well suited for healthcare brands that need stronger trust, readability, and conversion clarity across devices."
    },
    "E-Commerce": {
      outcome: "Clearer product value and improved buying intent.",
      challenge:
        "E-commerce stores need more than product listings. They need structured merchandising, confidence-building presentation, and a faster path from attention to purchase intent.",
      strategy:
        "We focused on product clarity, conversion-led page structure, and a premium visual system that makes the catalog feel more valuable and easier to shop.",
      commercialFocus: ["Product confidence", "Conversion flow", "Speed perception"],
      engagementFit: "Best for stores that want better perceived value, cleaner product browsing, and stronger conversion readiness."
    },
    Consulting: {
      outcome: "Higher perceived authority and stronger consultation demand.",
      challenge:
        "Consulting businesses often compete on trust, expertise, and positioning. The website had to make the brand feel credible enough for serious conversations.",
      strategy:
        "We built the experience around authority messaging, clear service framing, and a stronger path into discovery calls so the business could attract better-fit inbound opportunities.",
      commercialFocus: ["Authority positioning", "Offer clarity", "Consultation conversion"],
      engagementFit: "Designed for firms that need premium positioning before prospects book a conversation."
    },
    "Real Estate": {
      outcome: "Better property discovery flow and more qualified lead submissions.",
      challenge:
        "Real estate audiences need fast trust, easy navigation, and a clear sense of what to do next. Disjointed presentation leads to weak inquiry quality.",
      strategy:
        "The project was shaped around listing clarity, premium presentation, and direct lead pathways so the brand could look more credible and capture better-fit inquiries.",
      commercialFocus: ["Listing clarity", "Trust signals", "Lead quality"],
      engagementFit: "Strong fit for brokerages or property brands that need a more polished and conversion-ready digital presence."
    }
  };

  return (
    profiles[normalizeIndustry(industry)] ?? {
      outcome: "Improved digital trust and clearer conversion flow.",
      challenge:
        "The business needed a stronger digital presentation to clarify the offer, build confidence faster, and convert more traffic into qualified inquiries.",
      strategy:
        "We approached the build as a conversion-focused business asset, with clearer messaging, stronger trust structure, and practical next-step pathways.",
      commercialFocus: ["Trust", "Clarity", "Inquiry conversion"],
      engagementFit: "Best for service businesses that need a more premium and structured web presence."
    }
  );
}

function buildOpportunity(title: string, industry: string) {
  const normalizedIndustry = normalizeIndustry(industry);
  return `${title} was positioned as a more premium ${normalizedIndustry.toLowerCase()} brand experience, designed to reduce friction, increase clarity, and make the next step feel more credible.`;
}

function buildExecutionSummary(servicesProvided: string[], tags: string[]) {
  const scopeItems = [...servicesProvided, ...tags].filter(Boolean);
  if (scopeItems.length === 0) {
    return "Premium UI direction, responsive implementation, conversion-focused messaging, and launch-ready page structure.";
  }

  return `${scopeItems.slice(0, 4).join(", ")} delivered through a structured build process focused on trust, readability, and conversion flow.`;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await db.portfolioProject.findUnique({ where: { slug: params.slug } }).catch(() => null);

  if (!project) {
    return buildMetadata({
      title: "Project Not Found | J-Digital Solutions",
      description: "Project not found.",
      path: `/portfolio/${params.slug}`
    });
  }

  return buildMetadata({
    title: `${project.title} | Projects | J-Digital Solutions`,
    description: project.shortSummary,
    path: `/portfolio/${project.slug}`
  });
}

export default async function PortfolioProjectPage({ params }: { params: { slug: string } }) {
  const project = await db.portfolioProject
    .findUnique({
      where: { slug: params.slug },
      include: {
        images: {
          orderBy: { position: "asc" }
        }
      }
    })
    .catch(() => null);

  if (!project) notFound();

  const profile = getIndustryProfile(project.industry);
  const galleryImages = [project.coverImage, ...project.images.map((image) => image.url)].filter(
    (value, index, items) => items.indexOf(value) === index
  );
  const scopeItems =
    project.servicesProvided.length > 0
      ? project.servicesProvided
      : ["Premium page structure", "Responsive front-end implementation", "Lead-focused call-to-action system"];

  return (
    <MarketingShell>
      <SectionWrapper variant="accent" glow="hero" withBottomDivider>
        <div className="mb-5">
          <Button asChild variant="ghost">
            <Link href="/portfolio">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>
          </Button>
        </div>

        <p className={typography.eyebrow}>Case Study</p>
        <h1 className={`mt-3 ${typography.heroTitle}`}>{project.title}</h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-200 sm:text-base">{project.shortSummary}</p>
      </SectionWrapper>

      <SoftWaveSeparator />

      <SectionWrapper variant="base" glow="soft">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr]">
          <PortfolioImageLightbox
            src={project.coverImage}
            alt={`${project.title} homepage screenshot`}
            previewClassName="h-72 sm:h-[420px]"
            imageClassName="p-2"
          />

          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Overview</p>
                <p className="text-sm text-slate-200"><strong className="text-white">Industry:</strong> {normalizeIndustry(project.industry)}</p>
                <p className="text-sm text-slate-200"><strong className="text-white">Status:</strong> {project.status}</p>
                <p className="text-sm text-slate-200"><strong className="text-white">Core Outcome:</strong> {profile.outcome}</p>
                <p className="text-sm text-slate-300">{profile.engagementFit}</p>
                {project.liveLink ? (
                  <Button asChild className="mt-2">
                    <Link href={project.liveLink} target="_blank">
                      Visit Live Project <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Commercial Focus</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {profile.commercialFocus.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="raised" withTopDivider withBottomDivider>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-2 text-cyan-200">
                <Target className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.2em]">Business Challenge</p>
              </div>
              <h2 className="text-2xl font-bold text-white">Why this project mattered</h2>
              <p className="text-sm text-slate-300">{profile.challenge}</p>
              <p className="text-sm text-slate-300">{buildOpportunity(project.title, project.industry)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-2 text-cyan-200">
                <Compass className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.2em]">Strategic Response</p>
              </div>
              <h2 className="text-2xl font-bold text-white">How the build was approached</h2>
              <p className="text-sm text-slate-300">{profile.strategy}</p>
              <p className="text-sm text-slate-300">{buildExecutionSummary(project.servicesProvided, project.tags)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-cyan-200">
                <Layers3 className="h-4 w-4" />
                <h3 className="text-xl font-semibold text-white">Execution Scope</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {scopeItems.map((service) => (
                  <li key={service} className="flex items-start gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                    {service}
                  </li>
                ))}
              </ul>
              {project.tags.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-cyan-200">
                <Sparkles className="h-4 w-4" />
                <h3 className="text-xl font-semibold text-white">Outcome Direction</h3>
              </div>
              <p className="mt-4 text-sm text-slate-300">{profile.outcome}</p>
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
                  Stronger visual trust from the first screen
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
                  Clearer offer presentation for faster decision-making
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
                  Better inquiry readiness through cleaner calls-to-action
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {galleryImages.length > 1 ? (
        <SectionWrapper variant="base" glow="soft" withTopDivider>
          <div className="premium-panel p-6 sm:p-8">
            <p className={typography.eyebrow}>Gallery</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Additional project screens</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-200">
              Review more screens from this build to see the visual system, page consistency, and presentation quality across the project.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {galleryImages.slice(1).map((image, index) => (
                <PortfolioImageLightbox
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${project.title} project screen ${index + 2}`}
                  previewClassName="h-64"
                  imageClassName="p-2"
                />
              ))}
            </div>
          </div>
        </SectionWrapper>
      ) : null}

      <SectionWrapper variant="accent" glow="soft" withTopDivider>
        <div className="premium-panel p-8 text-center">
          <h2 className="text-3xl font-bold text-white">Want a similar outcome for your business?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200">
            We can map your project into the right package, structure the offer clearly, and recommend the fastest realistic path to launch.
          </p>
          <Button asChild size="lg" className="mt-5">
            <Link href="/contact?package=startup">Book Free Consultation</Link>
          </Button>
        </div>
      </SectionWrapper>
    </MarketingShell>
  );
}
