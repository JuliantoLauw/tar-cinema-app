import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const movies = await prisma.movie.findMany({
    orderBy: { title: "asc" },
  });
  return NextResponse.json(movies);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newMovie = await prisma.movie.create({ data });
  return NextResponse.json(newMovie, { status: 201 });
}
