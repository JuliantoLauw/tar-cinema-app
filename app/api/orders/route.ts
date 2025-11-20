import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Gagal memuat riwayat:", error);
    return NextResponse.json({ error: "Gagal memuat riwayat" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const bookingCode = `TAR-${Date.now()}`;

    const newOrder = await prisma.order.create({
      data: {
        bookingCode: bookingCode,
        movieTitle: body.movieTitle,
        cinema: body.cinema,
        showtime: body.showtime,
        seats: body.seats,
        totalPrice: body.totalPrice,
        status: "Berhasil",
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan pesanan" }, { status: 500 });
  }
}
