import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MilestoneType } from "@prisma/client";

export const runtime = "nodejs";

const MILESTONE_TYPE_MAP: Record<string, MilestoneType> = {
  registration: "REGISTRATION",
  testnet: "TESTNET",
  "karma-gap": "KARMA_GAP",
  mainnet: "MAINNET",
  farcaster: "FARCASTER",
  "final-submission": "FINAL_SUBMISSION",
};

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

    const submissions = await prisma.milestoneSubmission.findMany({
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

    const submission = await prisma.milestoneSubmission.upsert({
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
