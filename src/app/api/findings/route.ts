import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetId = searchParams.get("targetId");

  try {
    const findings = await prisma.finding.findMany({
      where: targetId ? { targetId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        target: { select: { name: true } },
        _count: { select: { evidences: true } },
      },
    });
    return NextResponse.json(findings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const finding = await prisma.finding.create({ data: body });
    return NextResponse.json(finding, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
