import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type TeamMember = {
  memberName: string;
  memberGithub?: string;
  country?: string;
};

type UpdatePayload = {
  members: TeamMember[];
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;

    let body: UpdatePayload;
    try {
      body = (await req.json()) as UpdatePayload;
    } catch (err) {
      console.error("[PATCH] JSON parse error:", err);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const members = Array.isArray(body.members) ? body.members : [];

    if (members.length === 0) {
      return NextResponse.json(
        { error: "At least one team member is required" },
        { status: 400 },
      );
    }

    // Validate and clean member data
    const validMembers = members
      .map((m) => ({
        memberName: typeof m.memberName === "string" ? m.memberName.trim() : "",
        memberGithub: typeof m.memberGithub === "string" ? m.memberGithub.trim() : "",
        country: typeof m.country === "string" ? m.country.trim() : "",
      }))
      .filter((m) => m.memberName);

    if (validMembers.length === 0) {
      return NextResponse.json(
        { error: "At least one team member with a name is required" },
        { status: 400 },
      );
    }

    // Check if all members have a country
    const membersWithoutCountry = validMembers.filter((m) => !m.country);
    if (membersWithoutCountry.length > 0) {
      return NextResponse.json(
        { error: "Country is required for all team members" },
        { status: 400 },
      );
    }

    // Update team members
    // Delete all existing members
    await prisma.teamMember.deleteMany({
      where: { teamId },
    });

    // Create new members
    await prisma.teamMember.createMany({
      data: validMembers.map((m) => ({
        teamId,
        memberName: m.memberName,
        memberGithub: m.memberGithub || null,
        country: m.country || null,
      })),
    });

    const updatedTeam = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    return NextResponse.json({ ok: true, team: updatedTeam });
  } catch (error) {
    console.error("[PATCH] Database error:", error);
    console.error("[PATCH] Error stack:", error instanceof Error ? error.stack : "N/A");
    return NextResponse.json(
      { error: "Failed to update team. Please try again." },
      { status: 500 },
    );
  }
}
