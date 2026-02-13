import { AdminPageHeader } from "@/components/admin/page-header";
import { ActionForm } from "@/components/admin/action-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { saveSiteSettingsAction } from "@/lib/actions/admin";
import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-data";

export default async function AdminSiteSettingsPage() {
  // Avoid concurrent DB calls (Supabase session pooler can be sensitive to bursts).
  const settings = await getSiteSettings();
  const pricing = await db.pricingPackage.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <AdminPageHeader title="Site Settings" description="Manage brand identity, CTAs, social links, and SEO defaults." />

      <ActionForm action={saveSiteSettingsAction} submitLabel="Save Site Settings" className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input id="brandName" name="brandName" defaultValue={settings.brandName} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="highlightPackageSlug">Highlight Package</Label>
            <Select id="highlightPackageSlug" name="highlightPackageSlug" defaultValue={settings.highlightPackageSlug}>
              {pricing.map((pkg) => (
                <option key={pkg.id} value={pkg.slug}>
                  {pkg.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroHeadline">Hero Headline</Label>
          <Input id="heroHeadline" name="heroHeadline" defaultValue={settings.heroHeadline} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroSubheadline">Hero Subheadline</Label>
          <Textarea id="heroSubheadline" name="heroSubheadline" defaultValue={settings.heroSubheadline} required rows={4} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primaryCtaLabel">Primary CTA Label</Label>
            <Input id="primaryCtaLabel" name="primaryCtaLabel" defaultValue={settings.primaryCtaLabel} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryCtaLink">Primary CTA Link</Label>
            <Input id="primaryCtaLink" name="primaryCtaLink" defaultValue={settings.primaryCtaLink} required />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="secondaryCtaLabel">Secondary CTA Label</Label>
            <Input id="secondaryCtaLabel" name="secondaryCtaLabel" defaultValue={settings.secondaryCtaLabel} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryCtaLink">Secondary CTA Link</Label>
            <Input id="secondaryCtaLink" name="secondaryCtaLink" defaultValue={settings.secondaryCtaLink} required />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" defaultValue={settings.email || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={settings.phone || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="officeAddress">Office Address</Label>
            <Input id="officeAddress" name="officeAddress" defaultValue={settings.officeAddress || ""} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="messageButtonLabel">Message Button Label</Label>
            <Input id="messageButtonLabel" name="messageButtonLabel" defaultValue={settings.messageButtonLabel} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="messageButtonLink">Message Button Link</Label>
            <Input id="messageButtonLink" name="messageButtonLink" defaultValue={settings.messageButtonLink || ""} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="whatsappLink">WhatsApp Link</Label>
            <Input id="whatsappLink" name="whatsappLink" defaultValue={settings.whatsappLink || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="messengerLink">Messenger Link</Label>
            <Input id="messengerLink" name="messengerLink" defaultValue={settings.messengerLink || ""} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="calendarBookingLink">Calendar Booking Link</Label>
          <Input id="calendarBookingLink" name="calendarBookingLink" defaultValue={settings.calendarBookingLink || ""} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="facebookUrl">Facebook URL</Label>
            <Input id="facebookUrl" name="facebookUrl" defaultValue={settings.facebookUrl || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagramUrl">Instagram URL</Label>
            <Input id="instagramUrl" name="instagramUrl" defaultValue={settings.instagramUrl || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input id="linkedinUrl" name="linkedinUrl" defaultValue={settings.linkedinUrl || ""} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seoDefaultTitle">SEO Default Title</Label>
          <Input id="seoDefaultTitle" name="seoDefaultTitle" defaultValue={settings.seoDefaultTitle} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seoDefaultDescription">SEO Default Description</Label>
          <Textarea id="seoDefaultDescription" name="seoDefaultDescription" defaultValue={settings.seoDefaultDescription} rows={3} required />
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-200">
          <input type="checkbox" name="testimonialsEnabled" defaultChecked={settings.testimonialsEnabled} className="h-4 w-4" />
          Enable public testimonials section
        </label>
      </ActionForm>
    </div>
  );
}
