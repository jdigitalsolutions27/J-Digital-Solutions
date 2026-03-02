import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { MarketingShell } from "@/components/marketing/shell";
import { buildMetadata } from "@/lib/metadata";
import { typography } from "@/lib/typography";

export async function generateMetadata() {
  return buildMetadata({
    title: "Terms of Service | J-Digital Solutions",
    description: "Read the Terms of Service for J-Digital Solutions.",
    path: "/terms-of-service"
  });
}

export default function TermsOfServicePage() {
  return (
    <MarketingShell>
      <SectionWrapper variant="accent" glow="hero" withBottomDivider>
        <p className={typography.eyebrow}>Terms of Service</p>
        <h1 className={`mt-3 ${typography.heroTitle}`}>General terms for using this website</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          These terms outline the general use of this website and how inquiries and service discussions are handled.
        </p>
      </SectionWrapper>

      <SectionWrapper variant="raised" glow="soft" withTopDivider withBottomDivider>
        <div className="mx-auto max-w-4xl space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Website Use</h2>
            <p>
              By using this website, you agree to use it for lawful business and informational purposes only.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Inquiry Submissions</h2>
            <p>
              Submitting a form does not automatically create a client relationship. Projects, pricing, timelines, and
              scope are only finalized after direct agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Project Scope and Delivery</h2>
            <p>
              All website projects are subject to agreed scope, timeline, revisions, and client responsibilities. Final
              delivery schedules may depend on content readiness, approvals, and third-party integrations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Intellectual Property</h2>
            <p>
              Final ownership, asset usage, and transfer terms should be defined in the relevant project agreement or
              proposal before project completion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Contact</h2>
            <p>
              If you need clarification regarding these terms, contact us directly before entering into any project
              arrangement.
            </p>
          </section>
        </div>
      </SectionWrapper>
    </MarketingShell>
  );
}
