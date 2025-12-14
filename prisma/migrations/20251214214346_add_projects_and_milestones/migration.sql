-- CreateEnum
CREATE TYPE "MilestoneType" AS ENUM ('REGISTRATION', 'TESTNET', 'KARMA_GAP', 'MAINNET', 'FARCASTER', 'FINAL_SUBMISSION');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "registrationId" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_submissions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "milestoneType" "MilestoneType" NOT NULL,
    "contractAddress" TEXT,
    "karmaGapLink" TEXT,
    "farcasterLink" TEXT,
    "slidesLink" TEXT,
    "pitchDeckLink" TEXT,

    CONSTRAINT "milestone_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "projects_registrationId_idx" ON "projects"("registrationId");

-- CreateIndex
CREATE INDEX "milestone_submissions_projectId_idx" ON "milestone_submissions"("projectId");

-- CreateIndex
CREATE INDEX "milestone_submissions_milestoneType_idx" ON "milestone_submissions"("milestoneType");

-- CreateIndex
CREATE UNIQUE INDEX "milestone_submissions_projectId_milestoneType_key" ON "milestone_submissions"("projectId", "milestoneType");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "buildathon_registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_submissions" ADD CONSTRAINT "milestone_submissions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
