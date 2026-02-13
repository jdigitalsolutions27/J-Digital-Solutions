import { PageBackground } from "@/components/layout/PageBackground";
import { FloatingMessageButton } from "@/components/marketing/floating-message-button";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { getSiteSettings } from "@/lib/site-data";

export async function MarketingShell({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <MarketingHeader brandName={settings.brandName} />
      <PageBackground>
        <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
          {children}
        </main>
        <MarketingFooter
          brandName={settings.brandName}
          email={settings.email}
          phone={settings.phone}
          facebookUrl={settings.facebookUrl}
          instagramUrl={settings.instagramUrl}
          linkedinUrl={settings.linkedinUrl}
        />
      </PageBackground>
      <FloatingMessageButton href={settings.messageButtonLink || settings.whatsappLink || settings.messengerLink} label={settings.messageButtonLabel} />
    </div>
  );
}
