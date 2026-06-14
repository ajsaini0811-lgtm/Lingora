import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const language = await prisma.language.findUnique({ where: { code } });
  if (!language) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const units = await prisma.unit.findMany({
    where: { languageId: language.id },
    include: { lessons: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(units);
}
