import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GlowBandSeparator } from "@/components/layout/dividers/GlowBandSeparator";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { MarketingShell } from "@/components/marketing/shell";
import { PortfolioMasonry } from "@/components/marketing/portfolio-masonry";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/metadata";
import { typography } from "@/lib/typography";

export async function generateMetadata() {
  return buildMetadata({
    title: "Projects | J-Digital Solutions",
    description: "See sample and client website projects built by J-Digital Solutions across key industries.",
    path: "/portfolio"
  });
}

export default async function PortfolioPage() {
  const projects = await db.portfolioProject
    .findMany({
      include: {
        images: {
          orderBy: { position: "asc" }
        }
      },
      orderBy: { position: "asc" }
    })
    .catch(() => []);

  const featured = projects[0];

  return (
    <MarketingShell>
      <SectionWrapper variant="accent" glow="hero" withBottomDivider>
        <Reveal>
          <p className={typography.eyebrow}>Projects</p>
          <h1 className={`mt-3 ${typography.heroTitle}`}>Web projects that build trust and drive inquiries</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
            Selected builds for construction, healthcare, consulting, real estate, and e-commerce businesses.
          </p>
        </Reveal>
      </SectionWrapper>

      {featured ? (
        <SectionWrapper variant="raised" glow="soft" withTopDivider>
          <Reveal>
            <SectionHeading
              eyebrow="Featured Showcase"
              title={featured.title}
              description={featured.shortSummary}
            />
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr,1fr]">
            <Card className="overflow-hidden">
              <Link href={`/portfolio/${featured.slug}`} className="group relative block h-72 sm:h-[420px]" aria-label={`Open ${featured.title} case study`}>
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(56,189,248,0.12),rgba(255,255,255,0.04),rgba(96,165,250,0.12))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(186,230,253,0.24),transparent_48%)]" />
                <Image src={featured.coverImage} alt={featured.title} fill className="object-contain object-top p-2" />
                <span className="absolute bottom-3 right-3 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm transition group-hover:bg-white/20">
                  View Case
                </span>
              </Link>
            </Card>
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={featured.status === "CLIENT" ? "success" : "secondary"}>{featured.status}</Badge>
                  <Badge variant="outline">{featured.industry}</Badge>
                </div>
                <p className="text-sm text-slate-300">
                  Premium website execution with conversion-focused sections and trust-heavy messaging architecture.
                </p>
                <div className="flex flex-wrap gap-2">
                  {featured.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button asChild>
                  <Link href={`/portfolio/${featured.slug}`}>
                    View Full Case <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </SectionWrapper>
      ) : null}

      <GlowBandSeparator />

      <SectionWrapper variant="base" glow="soft" withTopDivider withBottomDivider>
        <Reveal>
          <SectionHeading
            eyebrow="All Projects"
            title="Filter and explore by industry"
            description="Each project includes problem context, solution structure, deliverables, and outcomes."
          />
        </Reveal>
        {projects.length > 0 ? (
          <div className="mt-10">
            <PortfolioMasonry
              projects={projects.map((project) => ({
                id: project.id,
                title: project.title,
                slug: project.slug,
                industry: project.industry,
                shortSummary: project.shortSummary,
                coverImage: project.coverImage,
                tags: project.tags,
                status: project.status
              }))}
            />
          </div>
        ) : (
          <Card className="mt-8 border-cyan-300/25 bg-cyan-500/[0.06]">
            <CardContent className="p-6 text-sm text-slate-200">
              No projects are published yet. Check back soon or book a consultation to see recommended build directions.
            </CardContent>
          </Card>
        )}
      </SectionWrapper>

      <SectionWrapper variant="accent" glow="hero" withTopDivider withBottomDivider>
        <Card className="border-cyan-300/30 bg-slate-900/60">
          <CardContent className="p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Want a portfolio-worthy website for your brand?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200">
              Book a consultation and we will recommend a structure based on your goals and market.
            </p>
            <Button asChild size="lg" className="mt-5">
              <Link href="/contact?package=startup">Book Free Consultation</Link>
            </Button>
          </CardContent>
        </Card>
      </SectionWrapper>
    </MarketingShell>
  );
}
