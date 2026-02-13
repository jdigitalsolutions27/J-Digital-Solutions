import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SoftWaveSeparator } from "@/components/layout/dividers/SoftWaveSeparator";
import { PortfolioImageLightbox } from "@/components/marketing/portfolio-image-lightbox";
import { MarketingShell } from "@/components/marketing/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/metadata";
import { typography } from "@/lib/typography";

function toOutcome(industry: string) {
  const map: Record<string, string> = {
    Construction: "Stronger trust positioning and improved quality of contractor inquiries.",
    Healthcare: "Cleaner mobile patient journey and better first-contact confidence.",
    "E-commerce": "Clearer product value and improved buying intent.",
    Consulting: "Higher perceived authority and stronger consultation demand.",
    "Real Estate": "Better property discovery flow and more qualified lead submissions."
  };
  return map[industry] ?? "Improved digital trust and clearer conversion flow.";
}

function buildProblem(industry: string) {
  return `The ${industry.toLowerCase()} brand needed a premium website experience to improve trust, clarify the offer, and turn traffic into qualified inquiries.`;
}

function buildSolution(title: string) {
  return `${title} was designed with a conversion-first structure, high-credibility visuals, and strategic call-to-actions tailored for Philippine buyer behavior.`;
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
  const project = await db.portfolioProject.findUnique({ where: { slug: params.slug } }).catch(() => null);

  if (!project) notFound();

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

          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Overview</p>
              <p className="text-sm text-slate-200"><strong className="text-white">Industry:</strong> {project.industry}</p>
              <p className="text-sm text-slate-200"><strong className="text-white">Status:</strong> {project.status}</p>
              <p className="text-sm text-slate-200"><strong className="text-white">Outcome:</strong> {toOutcome(project.industry)}</p>
              {project.liveLink ? (
                <Button asChild className="mt-2">
                  <Link href={project.liveLink} target="_blank">
                    Visit Live Project <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="raised" withTopDivider withBottomDivider>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="space-y-3 p-6">
              <h2 className="text-2xl font-bold text-white">Problem</h2>
              <p className="text-sm text-slate-300">{buildProblem(project.industry)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6">
              <h2 className="text-2xl font-bold text-white">Solution</h2>
              <p className="text-sm text-slate-300">{buildSolution(project.title)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white">Deliverables</h3>
              <ul className="mt-4 space-y-2">
                {project.servicesProvided.map((service) => (
                  <li key={service} className="flex items-start gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                    {service}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white">Outcome</h3>
              <p className="mt-3 text-sm text-slate-300">{toOutcome(project.industry)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="accent" glow="soft" withTopDivider>
        <div className="premium-panel p-8 text-center">
          <h2 className="text-3xl font-bold text-white">Want a similar outcome for your business?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200">
            Let us plan a custom build that fits your goals, timeline, and market positioning.
          </p>
          <Button asChild size="lg" className="mt-5">
            <Link href="/contact?package=startup">Book Free Consultation</Link>
          </Button>
        </div>
      </SectionWrapper>
    </MarketingShell>
  );
}
