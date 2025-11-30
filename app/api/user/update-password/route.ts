import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, oldPassword, newPassword } = await req.json();

    if (!id || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    if (user.password !== oldPassword) {
      return NextResponse.json({ error: "Password lama salah" }, { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });

    return NextResponse.json({ message: "Password berhasil diubah", user: updatedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mengganti password" }, { status: 500 });
  }
}
