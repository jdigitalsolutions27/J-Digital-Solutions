-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('CONSULTATION', 'AUDIT');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "leadType" "LeadType" NOT NULL DEFAULT 'CONSULTATION',
ADD COLUMN     "websiteOrFacebookLink" TEXT;

-- CreateIndex
CREATE INDEX "Lead_leadType_idx" ON "Lead"("leadType");
