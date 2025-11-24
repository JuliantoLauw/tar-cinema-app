import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logout berhasil" },
    { status: 200 }
  );
  
  // SET MULTIPLE HEADERS UNTUK PASTIKAN COOKIE TERHAPUS
  response.headers.set(
    'Set-Cookie',
    'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
  );
  
  // Tambahan header untuk coverage yang lebih luas
  response.headers.append(
    'Set-Cookie',
    'user=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
  );
  
  return response;
}