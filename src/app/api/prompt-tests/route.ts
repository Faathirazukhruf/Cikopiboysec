import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetId = searchParams.get("targetId");

  try {
    const tests = await prisma.promptTest.findMany({
      where: targetId ? { targetId } : undefined,
      orderBy: { createdAt: "desc" },
      include: { target: { select: { name: true } } },
    });
    return NextResponse.json(tests);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.targetId || !body.inputPrompt || !body.aiResponse) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const test = await prisma.promptTest.create({ 
      data: {
        targetId: body.targetId,
        inputPrompt: body.inputPrompt,
        systemContext: body.systemContext || null,
        variant: body.variant || null,
        score: body.score || null,
        aiResponse: body.aiResponse,
        behaviorObserved: body.behaviorObserved || null,
        safetyFlags: body.safetyFlags || null,
      } 
    });
    return NextResponse.json(test, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
