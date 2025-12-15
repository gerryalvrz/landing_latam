import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationIdRaw = searchParams.get("registrationId");
    // Treat missing/placeholder values as "no filter" to keep the UI resilient.
    const registrationId =
      registrationIdRaw &&
      registrationIdRaw !== "undefined" &&
      registrationIdRaw !== "null"
        ? registrationIdRaw
        : null;

    const projects = await prisma.project.findMany({
      where: registrationId ? { registrationId } : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { projects },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, registrationId } = body;

    if (!name || !registrationId) {
      return NextResponse.json(
        { error: "Name and registration ID are required" },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        registrationId,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
