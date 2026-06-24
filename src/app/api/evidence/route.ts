import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetId = searchParams.get("targetId");

  try {
    const evidences = await prisma.evidence.findMany({
      where: targetId ? { targetId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        target: { select: { name: true } },
        finding: { select: { title: true, severity: true } },
      },
    });
    return NextResponse.json(evidences);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const evidence = await prisma.evidence.create({ data: body });
    return NextResponse.json(evidence, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
