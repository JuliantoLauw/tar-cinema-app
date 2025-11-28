import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, photoUrl } = await req.json();

    if (!id || !name || !email) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, photoUrl },
    });

    return NextResponse.json({
      message: "Profil berhasil diperbarui",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
