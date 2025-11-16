'use client'; // WAJIB: Menjadikan ini Client Component untuk interaktivitas

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation'; // Hook untuk mendapatkan [id]

// Tipe data untuk Movie (sesuaikan dengan skema Prisma Anda)
interface Movie {
  id: string;
  title: string;
  price: number; // Asumsi Anda punya harga di model Movie
  // tambahkan properti lain jika perlu
}

// Tipe data untuk Order Summary (dummy, karena tidak dari API)
interface OrderSummary {
  showtime: string;
  seats: string[];
  pricePerTicket: number;
  adminFee: number;
}

export default function CheckoutPage() {
  const params = useParams();
  const id = params?.id as string;

  // State untuk data yang di-fetch
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data dummy untuk ringkasan (kursi, jadwal, dll.)
  // Anda bisa ganti ini dengan data dari context atau state management
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    showtime: 'Sabtu, 12 Nov 2025, 18:30',
    seats: ['C8', 'C9'],
    pricePerTicket: 50000, // Harga ini bisa diambil dari movie.price
    adminFee: 3000,
  });

  // State untuk form interaktif
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherStatus, setVoucherStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 1. FLOW: Mengambil data detail dari API Anda
  useEffect(() => {
    if (!id) return; // Jangan fetch jika id belum siap
    console.log(id);
    const fetchMovie = async () => {
      setIsLoadingMovie(true);
      setError(null);
      try {
        const response = await fetch(`/api/movies/${id}`);
        console.log(response)
        if (!response.ok) {
          throw new Error('Film tidak ditemukan');
        }
        const data: Movie = await response.json();
        setMovie(data);
        // Set harga tiket berdasarkan data film
        setOrderSummary(prev => ({ ...prev, pricePerTicket: data.price || 50000 }));
      } catch (err) {
        console.log(err);
        setError("Gagal mengambil data film.");
      } finally {
        setIsLoadingMovie(false);
      }
    };

    fetchMovie();
  }, [id]); // dependency array

  // Kalkulasi total
  const subtotal = useMemo(() => {
    return orderSummary.pricePerTicket * orderSummary.seats.length;
  }, [orderSummary.pricePerTicket, orderSummary.seats.length]);

  const total = useMemo(() => {
    return subtotal + orderSummary.adminFee - discount;
  }, [subtotal, orderSummary.adminFee, discount]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  // Handler interaktif
  const handleApplyVoucher = () => {
    if (voucherCode === 'HEMAT20') {
      setDiscount(subtotal * 0.2);
      setVoucherStatus({ type: 'success', message: 'Voucher berhasil digunakan!' });
    } else {
      setDiscount(0);
      setVoucherStatus({ type: 'error', message: 'Kode voucher tidak valid.' });
    }
  };

  // 3. FLOW: Mengirim data ke API checkout (dummy)
  const handlePayment = async () => {
    setIsProcessing(true);
    setVoucherStatus(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movie?.id,
          showtime: orderSummary.showtime,
          seats: orderSummary.seats,
          total,
          paymentMethod,
        }),
      });

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        const result = await response.json();
        setVoucherStatus({ type: 'error', message: result.error || 'Pembayaran gagal.' });
      }
    } catch (error) {
      setVoucherStatus({ type: 'error', message: 'Tidak dapat terhubung ke server.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    window.location.href = '/'; // Kembali ke Home
  };

  // --- Render ---

  if (isLoadingMovie) {
    return (
      <main className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Memuat data film...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container my-5">
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="container my-5">
        <div className="alert alert-warning">Film tidak ditemukan.</div>
      </main>
    );
  }

  // 2. FLOW: Menampilkan data di checkout.tsx
  return (
    <>
      <main className="container my-5">
        <h2 className="mb-4">Checkout Pesanan - {movie.title}</h2>

        <div className="row g-5">
          <div className="col-md-7">
            <h3>Ringkasan Pesanan</h3>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Film</span>
                    <strong>{movie.title}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Jadwal</span>
                    <strong>{orderSummary.showtime}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Kursi</span>
                    <strong>{orderSummary.seats.join(', ')}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Harga Tiket ({orderSummary.seats.length}x)</span>
                    <span>{formatCurrency(orderSummary.pricePerTicket)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Biaya Admin</span>
                    <span>{formatCurrency(orderSummary.adminFee)}</span>
                  </li>
                  {discount > 0 && (
                    <li className="list-group-item d-flex justify-content-between text-success">
                      <span>Diskon Voucher</span>
                      <strong>- {formatCurrency(discount)}</strong>
                    </li>
                  )}
                  <li className="list-group-item d-flex justify-content-between fs-5 bg-light">
                    <strong>Total</strong>
                    <strong>{formatCurrency(total)}</strong>
                  </li>
                </ul>
              </div>
            </div>

            <h3>Kode Voucher</h3>
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="input-group">
                  <input
                    type="text"
                    id="voucher-code"
                    className={`form-control ${voucherStatus ? (voucherStatus.type === 'success' ? 'is-valid' : 'is-invalid') : ''}`}
                    placeholder="Masukkan kode voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    disabled={isProcessing}
                  />
                  <button
                    id="apply-voucher-btn"
                    className="btn btn-outline-secondary"
                    onClick={handleApplyVoucher}
                    disabled={isProcessing}
                  >
                    Gunakan
                  </button>
                </div>
                {voucherStatus && (
                  <p id="voucher-status" className={`mt-2 ${voucherStatus.type === 'success' ? 'text-success' : 'text-danger'}`}>
                    {voucherStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <h3>Metode Pembayaran</h3>
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="form-check fs-5 mb-3">
                  <input type="radio" id="credit-card" name="payment" value="credit-card" className="form-check-input" checked={paymentMethod === 'credit-card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <label htmlFor="credit-card" className="form-check-label">Kartu Kredit / Debit</label>
                </div>
                <div className="form-check fs-5 mb-3">
                  <input type="radio" id="bank-transfer" name="payment" value="bank-transfer" className="form-check-input" checked={paymentMethod === 'bank-transfer'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <label htmlFor="bank-transfer" className="form-check-label">Transfer Bank</label>
                </div>
                <div className="form-check fs-5">
                  <input type="radio" id="e-wallet" name="payment" value="e-wallet" className="form-check-input" checked={paymentMethod === 'e-wallet'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <label htmlFor="e-wallet" className="form-check-label">E-Wallet (GoPay, OVO, DANA)</label>
                </div>
              </div>
            </div>

            <div className="d-grid mt-4">
              <button
                id="pay-btn"
                className="btn btn-primary btn-lg"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span className="ms-2">Memproses...</span>
                  </>
                ) : (
                  `Bayar Sekarang (${formatCurrency(total)})`
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Sukses */}
      {showSuccessModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content text-center">
                <div className="modal-body p-5">
                  <span className="display-1">✅</span>
                  <h3 className="mt-3">Pembayaran Berhasil!</h3>
                  <p className="lead text-muted">Tiket Anda telah dikonfirmasi.</p>
                  <button type="button" className="btn btn-primary btn-lg mt-3" onClick={handleCloseModal}>
                    Kembali ke Home
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}
