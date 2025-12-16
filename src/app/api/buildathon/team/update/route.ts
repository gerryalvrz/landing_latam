import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type TeamMember = {
  id: string;
  memberName: string;
  memberEmail: string;
  memberGithub?: string | null;
  country?: string | null;
};

type UpdatePayload = {
  teamId: string;
  teamName: string;
  walletAddress: string;
  members: TeamMember[];
};

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as UpdatePayload;
    const { teamId, teamName, walletAddress, members } = body;

    if (!teamId || !teamName || !walletAddress || !members) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (members.length === 0) {
      return NextResponse.json(
        { error: "At least one team member is required" },
        { status: 400 }
      );
    }

    // Validate all members have required fields
    const invalidMembers = members.filter(
      (m) => !m.memberName?.trim() || !m.memberEmail?.trim() || !m.country?.trim()
    );

    if (invalidMembers.length > 0) {
      return NextResponse.json(
        { error: "All members must have name, email, and country" },
        { status: 400 }
      );
    }

    // Check for duplicate emails within the submission
    const emails = members.map((m) => m.memberEmail.trim().toLowerCase());
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
      return NextResponse.json(
        { error: "Duplicate email addresses in team members" },
        { status: 400 }
      );
    }

    // Get existing team to compare members
    const existingTeam = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!existingTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Determine which members to delete, update, and create
    const existingMemberIds = existingTeam.members.map((m) => m.id);
    const updatedMemberIds = members
      .filter((m) => !m.id.startsWith("new-"))
      .map((m) => m.id);
    const membersToDelete = existingMemberIds.filter(
      (id) => !updatedMemberIds.includes(id)
    );

    // Update team in a transaction
    try {
      await prisma.$transaction(async (tx) => {
        // Update team basic info
        await tx.team.update({
          where: { id: teamId },
          data: {
            teamName: teamName.trim(),
            walletAddress: walletAddress.trim(),
          },
        });

        // Delete removed members
        if (membersToDelete.length > 0) {
          await tx.teamMember.deleteMany({
            where: { id: { in: membersToDelete } },
          });
        }

        // Update or create members
        for (const member of members) {
          if (member.id.startsWith("new-")) {
            // Create new member
            await tx.teamMember.create({
              data: {
                teamId,
                memberName: member.memberName.trim(),
                memberEmail: member.memberEmail.trim(),
                memberGithub: member.memberGithub?.trim() || null,
                country: member.country?.trim() || null,
              },
            });
          } else {
            // Update existing member
            await tx.teamMember.update({
              where: { id: member.id },
              data: {
                memberName: member.memberName.trim(),
                memberEmail: member.memberEmail.trim(),
                memberGithub: member.memberGithub?.trim() || null,
                country: member.country?.trim() || null,
              },
            });
          }
        }
      });

      return NextResponse.json({ ok: true });
    } catch (dbError) {
      // Check for unique constraint violation on memberEmail
      if (
        dbError &&
        typeof dbError === "object" &&
        "code" in dbError &&
        dbError.code === "P2002"
      ) {
        return NextResponse.json(
          {
            error:
              "One or more email addresses are already registered with another team",
          },
          { status: 400 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error("[PUT] Database error:", error);
    console.error(
      "[PUT] Error stack:",
      error instanceof Error ? error.stack : "N/A"
    );
    return NextResponse.json(
      { error: "Failed to update team. Please try again." },
      { status: 500 }
    );
  }
}
