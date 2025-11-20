'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';

interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get data from URL params
  const seatsParam = searchParams.get('seats');
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');
  const cinemaParam = searchParams.get('cinema');

  const selectedSeats = seatsParam ? seatsParam.split(',') : [];
  const selectedDate = dateParam || '-';
  const selectedTime = timeParam || '-';
  const selectedCinema = cinemaParam || 'CGV Grand Indonesia';

  // Form states
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherStatus, setVoucherStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingCodeResult, setBookingCodeResult] = useState('');

  const pricePerTicket = 50000;
  const adminFee = 3000;

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      setIsLoadingMovie(true);
      setError(null);
      try {
        const response = await fetch(`/api/movies/${id}`);
        if (!response.ok) {
          throw new Error('Film tidak ditemukan');
        }
        const data: Movie = await response.json();
        setMovie(data);
      } catch (err) {
        setError('Gagal mengambil data film.');
      } finally {
        setIsLoadingMovie(false);
      }
    };

    fetchMovie();
  }, [id]);

  const subtotal = useMemo(() => {
    return pricePerTicket * selectedSeats.length;
  }, [selectedSeats.length]);

  const total = useMemo(() => {
    return subtotal + adminFee - discount;
  }, [subtotal, adminFee, discount]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleApplyVoucher = () => {
    if (voucherCode === 'HEMAT20') {
      setDiscount(subtotal * 0.2);
      setVoucherStatus({ type: 'success', message: 'Voucher berhasil digunakan! Diskon 20%' });
    } else if (voucherCode === 'DISKON10') {
      setDiscount(subtotal * 0.1);
      setVoucherStatus({ type: 'success', message: 'Voucher berhasil digunakan! Diskon 10%' });
    } else {
      setDiscount(0);
      setVoucherStatus({ type: 'error', message: 'Kode voucher tidak valid.' });
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setVoucherStatus(null);

    try {
        const orderData = {
            movieTitle: movie?.title || "Unknown Movie",
            cinema: selectedCinema,
            showtime: `${formatDate(selectedDate)} - ${selectedTime}`,
            seats: selectedSeats.join(', '),
            totalPrice: total
        };

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error("Gagal memproses pembayaran");

        const result = await response.json();
        setBookingCodeResult(result.bookingCode);

        setShowSuccessModal(true);

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    router.push('/history');
  };

  if (isLoadingMovie) {
    return (
      <main className="container my-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-light">Memuat data...</p>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="container my-5">
        <div className="alert alert-danger">
          <strong>Error:</strong> {error || 'Film tidak ditemukan'}
        </div>
      </main>
    );
  }

  return (
    <>
      {/* <main className="container my-4"> */}
        <h2 className="mb-4 text-warning text-center">Checkout Pesanan</h2>

        <div className="row g-4">
          {/* Left Column - Order Summary */}
          <div className="col-lg-7">
            <div className="card bg-dark border-secondary mb-4">
              <div className="card-body">
                <h5 className="text-warning mb-3">Ringkasan Pesanan</h5>

                <table className="table table-dark table-borderless">
                  <tbody>
                    <tr>
                      <td className="text-light">Film</td>
                      <td className="text-end text-light fw-bold">{movie.title}</td>
                    </tr>
                    <tr>
                      <td className="text-light">Bioskop</td>
                      <td className="text-end text-light">{selectedCinema}</td>
                    </tr>
                    <tr>
                      <td className="text-light">Tanggal</td>
                      <td className="text-end text-light">{formatDate(selectedDate)}</td>
                    </tr>
                    <tr>
                      <td className="text-light">Jam</td>
                      <td className="text-end text-light">{selectedTime} WIB</td>
                    </tr>
                    <tr>
                      <td className="text-light">Kursi</td>
                      <td className="text-end">
                        <span className="badge bg-warning text-dark">
                          {selectedSeats.join(', ')}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <hr className="border-secondary" />

                <table className="table table-dark table-borderless">
                  <tbody>
                    <tr>
                      <td className="text-light">
                        Harga Tiket ({selectedSeats.length}x)
                      </td>
                      <td className="text-end text-light">{formatCurrency(pricePerTicket)}</td>
                    </tr>
                    <tr>
                      <td className="text-light">Subtotal</td>
                      <td className="text-end text-light">{formatCurrency(subtotal)}</td>
                    </tr>
                    <tr>
                      <td className="text-light">Biaya Admin</td>
                      <td className="text-end text-light">{formatCurrency(adminFee)}</td>
                    </tr>
                    {discount > 0 && (
                      <tr>
                        <td className="text-success">Diskon Voucher</td>
                        <td className="text-end text-success fw-bold">
                          - {formatCurrency(discount)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <hr className="border-secondary" />

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-light fs-5 fw-bold">Total Bayar</span>
                  <span className="text-warning fs-4 fw-bold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Voucher Section */}
            <div className="card bg-dark border-secondary">
              <div className="card-body">
                <h5 className="text-warning mb-3">Kode Voucher</h5>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className={`form-control bg-secondary text-light border-0 ${
                      voucherStatus
                        ? voucherStatus.type === 'success'
                          ? 'is-valid'
                          : 'is-invalid'
                        : ''
                    }`}
                    placeholder="Masukkan kode voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    disabled={isProcessing}
                  />
                  <button
                    className="btn btn-warning"
                    onClick={handleApplyVoucher}
                    disabled={isProcessing || !voucherCode}
                  >
                    Gunakan
                  </button>
                </div>
                {voucherStatus && (
                  <small
                    className={`${
                      voucherStatus.type === 'success' ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {voucherStatus.message}
                  </small>
                )}
                <small className="text-muted d-block mt-2">
                  Coba: HEMAT20 atau DISKON10
                </small>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Method */}
          <div className="col-lg-5">
            <div className="card bg-dark border-secondary mb-4">
              <div className="card-body">
                <h5 className="text-warning mb-3">Metode Pembayaran</h5>

                <div className="form-check mb-3 p-3 border border-secondary rounded">
                  <input
                    type="radio"
                    id="credit-card"
                    name="payment"
                    value="credit-card"
                    className="form-check-input"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="credit-card" className="form-check-label text-light w-100">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-credit-card fs-4 me-2"></i>
                      <span>Kartu Kredit / Debit</span>
                    </div>
                  </label>
                </div>

                <div className="form-check mb-3 p-3 border border-secondary rounded">
                  <input
                    type="radio"
                    id="bank-transfer"
                    name="payment"
                    value="bank-transfer"
                    className="form-check-input"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="bank-transfer" className="form-check-label text-light w-100">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-bank fs-4 me-2"></i>
                      <span>Transfer Bank</span>
                    </div>
                  </label>
                </div>

                <div className="form-check mb-3 p-3 border border-secondary rounded">
                  <input
                    type="radio"
                    id="e-wallet"
                    name="payment"
                    value="e-wallet"
                    className="form-check-input"
                    checked={paymentMethod === 'e-wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="e-wallet" className="form-check-label text-light w-100">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-wallet2 fs-4 me-2"></i>
                      <span>E-Wallet (GoPay, OVO, DANA)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <button
              className="btn btn-warning w-100 btn-lg fw-bold"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Memproses...
                </>
              ) : (
                <>Bayar Sekarang</>
              )}
            </button>
          </div>
        </div>
      {/* </main> */}

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: 'block' }}
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark border-warning">
                <div className="modal-body text-center p-5">
                  <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '80px' }}></i>
                  </div>
                  <h3 className="text-warning mb-3">Pembayaran Berhasil!</h3>
                  <p className="text-light mb-4">
                    Tiket berhasil dibuat! Kode Booking: <strong className="text-warning">{bookingCodeResult}</strong>
                  </p>
                  <button
                    type="button"
                    className="btn btn-warning btn-lg px-5"
                    onClick={handleCloseModal}
                  >
                    Lihat Riwayat
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
