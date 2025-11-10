import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="container mt-5 text-center text-light">
      <h1 className="display-4 fw-bold">404</h1>
      <p className="text-secondary">Halaman tidak ditemukan.</p>

      <Link href="/" className="btn btn-outline-light mt-3">
        Kembali ke Beranda
      </Link>
    </main>
  );
}
