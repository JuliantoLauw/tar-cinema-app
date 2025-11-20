import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container py-5">
      <h2 className="text-warning mb-4">Riwayat Transaksi</h2>

      {orders.length === 0 ? (
        // Empty State
        <div className="card bg-dark border-secondary text-center p-5">
          <div className="card-body">
            <p className="text-light mb-3">Anda belum memiliki riwayat transaksi.</p>
            <Link href="/" className="btn btn-warning">
              Cari Film Sekarang
            </Link>
          </div>
        </div>
      ) : (
        // List Riwayat
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/history/${order.bookingCode}`}
              className="text-decoration-none"
            >
              <div
                className="card bg-dark border-secondary text-light history-card"
                style={{ transition: "transform 0.2s" }}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="text-warning mb-1">{order.movieTitle}</h5>
                    <p className="mb-1 small text-light">{order.cinema}</p>
                    <small className="text-muted">
                        {/* Format tanggal sederhana */}
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </small>
                  </div>
                  <div>
                    <span className="badge bg-success rounded-pill px-3 py-2">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .history-card:hover {
            transform: translateY(-4px);
            border-color: #ffc107 !important;
        }
      `}</style>
    </main>
  );
}
