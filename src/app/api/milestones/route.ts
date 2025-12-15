import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type PrismaMilestoneType =
  | "REGISTRATION"
  | "TESTNET"
  | "KARMA_GAP"
  | "MAINNET"
  | "FARCASTER"
  | "FINAL_SUBMISSION";

const MILESTONE_TYPE_MAP: Record<string, PrismaMilestoneType> = {
  registration: "REGISTRATION",
  testnet: "TESTNET",
  "karma-gap": "KARMA_GAP",
  mainnet: "MAINNET",
  farcaster: "FARCASTER",
  "final-submission": "FINAL_SUBMISSION",
};

const MILESTONE_PREREQ: Record<PrismaMilestoneType, PrismaMilestoneType | null> = {
  REGISTRATION: null,
  TESTNET: "REGISTRATION",
  KARMA_GAP: "TESTNET",
  MAINNET: "KARMA_GAP",
  // Optional milestone, but still only after Mainnet.
  FARCASTER: "MAINNET",
  // Final depends on Mainnet (Farcaster is optional).
  FINAL_SUBMISSION: "MAINNET",
};

const MILESTONE_LABEL: Record<PrismaMilestoneType, string> = {
  REGISTRATION: "Registration",
  TESTNET: "Testnet",
  KARMA_GAP: "Karma Gap",
  MAINNET: "Mainnet",
  FARCASTER: "Farcaster",
  FINAL_SUBMISSION: "Final submission",
};

const db = prisma as unknown as {
  milestone: {
    findMany: (args: unknown) => Promise<unknown>;
    upsert: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  };
};

function isValidEvmAddress(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const v = value.trim();
  // Celo addresses are EVM addresses: 0x + 40 hex chars
  if (!/^0x[0-9a-fA-F]{40}$/.test(v)) return false;
  // Avoid the all-zero address
  if (/^0x0{40}$/.test(v)) return false;
  return true;
}

const KARMA_PROJECT_PREFIX = "https://www.karmahq.xyz/project/";

function isValidKarmaProjectUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const v = value.trim();
  return v.startsWith(KARMA_PROJECT_PREFIX) && v.length > KARMA_PROJECT_PREFIX.length;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const submissions = await db.milestone.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch milestone submissions" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      projectId,
      milestoneType,
      contractAddress,
      karmaGapLink,
      farcasterLink,
      slidesLink,
      pitchDeckLink,
    } = body;

    if (!projectId || !milestoneType) {
      return NextResponse.json(
        { error: "Project ID and milestone type are required" },
        { status: 400 },
      );
    }

    const prismaType = MILESTONE_TYPE_MAP[milestoneType];
    if (!prismaType) {
      return NextResponse.json(
        { error: "Invalid milestone type" },
        { status: 400 },
      );
    }

    // Enforce milestone order (Farcaster optional, but still only after Mainnet).
    const prereq = MILESTONE_PREREQ[prismaType];
    if (prereq) {
      const existing = (await db.milestone.findMany({
        where: {
          projectId,
          milestoneType: prereq,
        },
        select: { id: true },
        take: 1,
      })) as Array<{ id: string }>;

      if (!Array.isArray(existing) || existing.length === 0) {
        return NextResponse.json(
          {
            error: `Please complete "${MILESTONE_LABEL[prereq]}" before submitting "${MILESTONE_LABEL[prismaType]}".`,
          },
          { status: 400 },
        );
      }
    }

    // Address validation (Celo uses EVM addresses)
    if (prismaType === "TESTNET" || prismaType === "MAINNET") {
      if (!isValidEvmAddress(contractAddress)) {
        return NextResponse.json(
          {
            error:
              prismaType === "TESTNET"
                ? "Please provide a valid Celo testnet contract address (0x + 40 hex characters)."
                : "Please provide a valid Celo mainnet contract address (0x + 40 hex characters).",
          },
          { status: 400 },
        );
      }
    }

    // Karma Gap project validation
    if (prismaType === "KARMA_GAP") {
      if (!isValidKarmaProjectUrl(karmaGapLink)) {
        return NextResponse.json(
          {
            error: `Karma Gap link must start with ${KARMA_PROJECT_PREFIX}`,
          },
          { status: 400 },
        );
      }
    } else if (karmaGapLink !== undefined && karmaGapLink !== null && karmaGapLink !== "") {
      // If provided on other milestones, keep it consistent too.
      if (!isValidKarmaProjectUrl(karmaGapLink)) {
        return NextResponse.json(
          {
            error: `Karma Gap link must start with ${KARMA_PROJECT_PREFIX}`,
          },
          { status: 400 },
        );
      }
    }

    const submission = await db.milestone.upsert({
      where: {
        projectId_milestoneType: {
          projectId,
          milestoneType: prismaType,
        },
      },
      update: {
        contractAddress,
        karmaGapLink,
        farcasterLink,
        slidesLink,
        pitchDeckLink,
      },
      create: {
        projectId,
        milestoneType: prismaType,
        contractAddress,
        karmaGapLink,
        farcasterLink,
        slidesLink,
        pitchDeckLink,
      },
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to submit milestone" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const milestoneId = searchParams.get("milestoneId");

    if (!milestoneId) {
      return NextResponse.json(
        { error: "Milestone ID is required" },
        { status: 400 },
      );
    }

    await db.milestone.delete({ where: { id: milestoneId } });

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete milestone" },
      { status: 500 },
    );
  }
}
