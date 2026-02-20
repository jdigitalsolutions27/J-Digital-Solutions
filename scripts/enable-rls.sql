-- Enable Row Level Security (RLS) on all Prisma-managed app tables.
-- This removes Supabase Security Advisor warnings: "RLS Disabled in Public".
--
-- Notes:
-- 1) By default, enabling RLS with no policies means anon/authenticated users
--    cannot read/write rows through PostgREST.
-- 2) Your app uses Prisma server-side and service-role operations for media,
--    so enabling RLS is safe for this architecture.

ALTER TABLE IF EXISTS public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."SiteSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."PortfolioProject" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."ProjectCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."ProjectImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."ProcessStep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."PricingPackage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."FAQ" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Testimonial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."MediaAsset" ENABLE ROW LEVEL SECURITY;

-- Optional: uncomment to force RLS even for table owner (except BYPASSRLS roles).
-- ALTER TABLE IF EXISTS public."User" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."SiteSettings" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."Service" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."PortfolioProject" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."ProjectCategory" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."ProjectImage" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."ProcessStep" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."PricingPackage" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."FAQ" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."Testimonial" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."Lead" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public."MediaAsset" FORCE ROW LEVEL SECURITY;

