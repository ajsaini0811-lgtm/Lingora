import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, score } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const progress = await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId: id } },
    create: { userId, lessonId: id, score, completedAt: new Date() },
    update: { score, completedAt: new Date() },
  });
  return NextResponse.json(progress);
}
