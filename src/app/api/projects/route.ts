import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("registrationId");

    if (!registrationId) {
      return NextResponse.json(
        { error: "Registration ID is required" },
        { status: 400 },
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        registrationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ projects });
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
