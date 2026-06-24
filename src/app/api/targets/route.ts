import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const targets = await prisma.target.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            endpoints: true,
            findings: true,
            evidences: true,
            reports: true,
          },
        },
      },
    });
    return NextResponse.json(targets);
  } catch {
    return NextResponse.json({ error: "Failed to fetch targets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const target = await prisma.target.create({
      data: {
        name: body.name,
        baseUrl: body.baseUrl,
        scope: body.scope || null,
        authFlowType: body.authFlowType || null,
        aiModelInfo: body.aiModelInfo || null,
        notes: body.notes || null,
        status: body.status || "RESEARCHING",
      },
    });
    return NextResponse.json(target, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create target" }, { status: 500 });
  }
}
