import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

type ExportField =
  | "teamName"
  | "memberName"
  | "memberEmail"
  | "memberGithub"
  | "country"
  | "walletAddress"
  | "registrationDate"
  | "hasSubmission"
  | "karmaGapLink"
  | "tracks"
  | "submissionDate";

type SubmissionFilter = "all" | "submitted" | "not_submitted";

const FIELD_LABELS: Record<ExportField, string> = {
  teamName: "Team Name",
  memberName: "Member Names",
  memberEmail: "Member Emails",
  memberGithub: "GitHub Usernames",
  country: "Countries",
  walletAddress: "Wallet Address",
  registrationDate: "Registration Date",
  hasSubmission: "Has Submission",
  karmaGapLink: "Karma Gap Link",
  tracks: "Selected Tracks",
  submissionDate: "Submission Date",
};

export async function POST(request: Request) {
  // Verify admin authentication
  const isAdmin = await verifyAdminSession(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let body: { fields?: string[]; filter?: SubmissionFilter };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const requestedFields = (body.fields || []) as ExportField[];
    const submissionFilter: SubmissionFilter = body.filter || "all";

    if (requestedFields.length === 0) {
      return NextResponse.json(
        { error: "No fields selected for export" },
        { status: 400 }
      );
    }

    // Fetch all teams with their members and submissions
    let teams = await prisma.team.findMany({
      include: {
        members: true,
        submission: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Apply submission filter
    if (submissionFilter === "submitted") {
      teams = teams.filter((t) => t.submission !== null);
    } else if (submissionFilter === "not_submitted") {
      teams = teams.filter((t) => t.submission === null);
    }

    // Create CSV headers based on selected fields
    const csvHeaders = requestedFields.map((field) => FIELD_LABELS[field]);

    // Build CSV rows - one row per team, with members concatenated
    const csvRows = teams.map((team) => {
      const row: string[] = [];

      // Concatenate member info
      const memberNames = team.members.map((m) => m.memberName).join("; ");
      const memberEmails = team.members.map((m) => m.memberEmail).join("; ");
      const memberGithubs = team.members
        .map((m) => m.memberGithub || "")
        .filter(Boolean)
        .join("; ");
      const memberCountries = team.members
        .map((m) => m.country || "")
        .filter(Boolean)
        .join("; ");

      for (const field of requestedFields) {
        let value = "";

        switch (field) {
          case "teamName":
            value = team.teamName;
            break;
          case "memberName":
            value = memberNames;
            break;
          case "memberEmail":
            value = memberEmails;
            break;
          case "memberGithub":
            value = memberGithubs;
            break;
          case "country":
            value = memberCountries;
            break;
          case "walletAddress":
            value = team.walletAddress;
            break;
          case "registrationDate":
            value = new Date(team.createdAt).toISOString().split("T")[0];
            break;
          case "hasSubmission":
            value = team.submission ? "Yes" : "No";
            break;
          case "karmaGapLink":
            value = team.submission?.karmaGapLink || "";
            break;
          case "tracks":
            if (team.submission) {
              const tracks = [];
              if (team.submission.trackOpenTrack) tracks.push("Open Track");
              if (team.submission.trackFarcasterMiniapp)
                tracks.push("MiniApps");
              if (team.submission.trackSelf) tracks.push("Human.Tech");
              if (team.submission.trackV0) tracks.push("v0");
              value = tracks.join("; ");
            }
            break;
          case "submissionDate":
            value = team.submission
              ? new Date(team.submission.createdAt).toISOString().split("T")[0]
              : "";
            break;
        }

        row.push(value);
      }

      return row;
    });

    // Build CSV string
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="buildathon-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
