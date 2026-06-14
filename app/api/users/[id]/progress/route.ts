import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const progress = await prisma.progress.findMany({
    where: { userId: id },
    select: { lessonId: true, score: true, completedAt: true },
  });
  return NextResponse.json(progress);
}
