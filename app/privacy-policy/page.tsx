import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { MarketingShell } from "@/components/marketing/shell";
import { buildMetadata } from "@/lib/metadata";
import { typography } from "@/lib/typography";

export const revalidate = 300;

export async function generateMetadata() {
  return buildMetadata({
    title: "Privacy Policy | J-Digital Solutions",
    description: "Read the privacy policy for J-Digital Solutions.",
    path: "/privacy-policy"
  });
}

export default function PrivacyPolicyPage() {
  return (
    <MarketingShell>
      <SectionWrapper variant="accent" glow="hero" withBottomDivider>
        <p className={typography.eyebrow}>Privacy Policy</p>
        <h1 className={`mt-3 ${typography.heroTitle}`}>How we handle your information</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          This page explains what information we collect through the website and how we use it to respond to inquiries and improve our services.
        </p>
      </SectionWrapper>

      <SectionWrapper variant="raised" glow="soft" withTopDivider withBottomDivider>
        <div className="mx-auto max-w-4xl space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
            <p>
              When you submit a form on this website, we may collect details such as your name, email address,
              mobile number, business name, project details, preferred contact method, country, and timezone.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">How We Use Information</h2>
            <p>
              We use submitted information to review inquiries, communicate with prospective clients, recommend
              project direction, and improve service delivery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Data Handling</h2>
            <p>
              We do not sell submitted contact information. Data is stored in our website system and may be used for
              project communication, consultation follow-up, and internal record-keeping.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Third-Party Services</h2>
            <p>
              The website may use third-party providers for infrastructure, hosting, analytics, form delivery, media
              storage, and email notifications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Contact</h2>
            <p>
              If you have questions about how your information is used, contact us through the main contact page or by
              email.
            </p>
          </section>
        </div>
      </SectionWrapper>
    </MarketingShell>
  );
}
