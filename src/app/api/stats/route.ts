import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [targets, endpoints, promptTests, findings, evidences, reports] =
      await Promise.all([
        prisma.target.count(),
        prisma.endpoint.count(),
        prisma.promptTest.count(),
        prisma.finding.count(),
        prisma.evidence.count(),
        prisma.report.count(),
      ]);

    const criticalFindings = await prisma.finding.count({
      where: { severity: "CRITICAL" },
    });

    const openFindings = await prisma.finding.count({
      where: { status: "OPEN" },
    });

    return NextResponse.json({
      targets,
      endpoints,
      promptTests,
      findings,
      evidences,
      reports,
      criticalFindings,
      openFindings,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
