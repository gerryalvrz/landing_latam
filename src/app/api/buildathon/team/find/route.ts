import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find team member by email
    const member = await prisma.teamMember.findUnique({
      where: { memberEmail: email.trim() },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "No team found with this email address" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      team: member.team,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to find team" },
      { status: 500 }
    );
  }
}
