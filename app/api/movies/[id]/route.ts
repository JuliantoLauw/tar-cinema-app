import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}
export async function GET(_: Request, { params }: Params) {
  const { id } = await params;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: id },
    });
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);

  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const data = await request.json();
  const updatedMovie = await prisma.movie.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updatedMovie);
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.movie.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: "Movie deleted" }, { status: 200 });
}
