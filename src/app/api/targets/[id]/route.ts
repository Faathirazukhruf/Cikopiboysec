import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const target = await prisma.target.findUnique({
      where: { id },
      include: {
        endpoints: { orderBy: { createdAt: "desc" } },
        findings: { orderBy: { createdAt: "desc" } },
        evidences: { orderBy: { createdAt: "desc" } },
        reports: { orderBy: { createdAt: "desc" } },
        promptTests: { orderBy: { createdAt: "desc" } },
        authFlows: { orderBy: { createdAt: "desc" } },
        tools: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!target) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(target);
  } catch {
    return NextResponse.json({ error: "Failed to fetch target" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const target = await prisma.target.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(target);
  } catch {
    return NextResponse.json({ error: "Failed to update target" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.target.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete target" }, { status: 500 });
  }
}
