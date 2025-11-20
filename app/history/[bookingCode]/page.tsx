import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: { bookingCode: string };
}

export default async function HistoryDetailPage({ params }: PageProps) {
  const { bookingCode } = await params;

  const ticket = await prisma.order.findUnique({
    where: { bookingCode: bookingCode },
  });

  if (!ticket) {
    notFound();
  }

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const qrData = `TICKET:${ticket.bookingCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">

          {/* Tiket Wrapper */}
          <div className="bg-white text-dark rounded-4 shadow-lg overflow-hidden border-top border-5 border-warning">

            {/* Header */}
            <div className="p-4 text-center border-bottom border-2 border-dashed">
              <h3 className="fw-bold m-0">{ticket.movieTitle}</h3>
            </div>

            {/* Body */}
            <div className="p-4">
              {/* Kode Booking & QR */}
              <div className="text-center mb-4">
                <span className="text-muted small text-uppercase ls-1">Kode Booking</span>
                <h2 className="fw-bold letter-spacing-2 my-1">{ticket.bookingCode}</h2>

                <div className="bg-light p-3 d-inline-block rounded mt-2 border">
                  {/* QR Code Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="QR Code" width={150} height={150} />
                </div>
              </div>

              {/* Detail Items */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Bioskop</span>
                <span className="fw-bold text-end">{ticket.cinema}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Jadwal</span>
                <span className="fw-bold text-end">{ticket.showtime}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Kursi</span>
                <span className="fw-bold text-end">{ticket.seats}</span>
              </div>
              <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                <span className="text-muted">Total Bayar</span>
                <span className="fw-bold fs-5 text-success">{formatRupiah(ticket.totalPrice)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-light p-3 text-center text-muted small">
              Tunjukkan kode ini kepada petugas di bioskop.
            </div>
          </div>

          {/* Tombol Kembali */}
          <div className="text-center mt-4">
            <Link href="/history" className="text-decoration-none text-warning">
              &larr; Kembali ke Riwayat
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
