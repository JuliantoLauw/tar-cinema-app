'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: string;
}

type SeatStatus = 'available' | 'selected' | 'booked';

interface Seat {
  row: string;
  number: number;
  status: SeatStatus;
}

export default function SeatSelectionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const movieId = searchParams.get('movie');

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('2025-11-20');
  const [selectedTime, setSelectedTime] = useState('19:00');

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;
  const pricePerSeat = 50000;

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies/${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setMovie(data);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    // Generate seats
    const generatedSeats: Seat[] = [];
    const bookedSeats = ['C3', 'C4', 'D5', 'D6', 'E5', 'F7', 'F8']; // Demo booked seats

    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        generatedSeats.push({
          row,
          number: i,
          status: bookedSeats.includes(seatId) ? 'booked' : 'available',
        });
      }
    });

    setSeats(generatedSeats);
  }, []);

  const handleSeatClick = (row: string, number: number) => {
    const seatId = `${row}${number}`;
    const seat = seats.find((s) => s.row === row && s.number === number);

    if (seat?.status === 'booked') return;

    setSeats((prevSeats) =>
      prevSeats.map((s) => {
        if (s.row === row && s.number === number) {
          const newStatus = s.status === 'selected' ? 'available' : 'selected';
          return { ...s, status: newStatus };
        }
        return s;
      })
    );

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      alert('Silakan pilih kursi terlebih dahulu!');
      return;
    }

    const checkoutData = {
      movieId,
      seats: selectedSeats,
      date: selectedDate,
      time: selectedTime,
    };

    router.push(
      `/movies/${movieId}/checkout?seats=${selectedSeats.join(',')}&date=${selectedDate}&time=${selectedTime}`
    );
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  if (isLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Film tidak ditemukan</div>
        <Link href="/" className="btn btn-warning">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="text-center mb-4">
        <h2 className="text-warning mb-2">Film Pilihan Anda: [{movie.title}]</h2>
        <p className="text-muted">
          {movie.genre} • {movie.rating} • {movie.duration}
        </p>
      </div>

      <div className="row g-4">
        {/* Seat Grid */}
        <div className="col-lg-8">
          <div className="card bg-dark border-secondary">
            <div className="card-body">
              <h4 className="text-warning text-center mb-3">LAYAR BIOSKOP</h4>
              <div className="screen-indicator mb-4"></div>

              <div className="seat-grid">
                {rows.map((row) => (
                  <div key={row} className="seat-row d-flex align-items-center mb-2">
                    <span className="row-label text-warning me-3 fw-bold">{row}</span>
                    <div className="d-flex gap-2">
                      {seats
                        .filter((s) => s.row === row)
                        .map((seat) => (
                          <button
                            key={`${seat.row}${seat.number}`}
                            className={`seat ${seat.status}`}
                            onClick={() => handleSeatClick(seat.row, seat.number)}
                            disabled={seat.status === 'booked'}
                          >
                            {seat.number}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="legend d-flex justify-content-center gap-4 mt-4">
                <div className="d-flex align-items-center gap-2">
                  <span className="legend-box available"></span>
                  <small className="text-light">Tersedia</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="legend-box selected"></span>
                  <small className="text-light">Dipilih</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="legend-box booked"></span>
                  <small className="text-light">Terisi</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="col-lg-4">
          <div className="card bg-dark border-secondary mb-3">
            <div className="card-body">
              <h5 className="text-warning mb-3">Ringkasan Pesanan</h5>
              
              <div className="mb-3">
                <label className="form-label text-light">Tanggal</label>
                <input
                  type="date"
                  className="form-control bg-secondary text-light border-0"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Jam Tayang</label>
                <select
                  className="form-select bg-secondary text-light border-0"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="13:00">13:00 WIB</option>
                  <option value="16:00">16:00 WIB</option>
                  <option value="19:00">19:00 WIB</option>
                  <option value="21:30">21:30 WIB</option>
                </select>
              </div>

              <hr className="border-secondary" />

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-light">Kursi Dipilih:</span>
                  <span className="text-warning fw-bold">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-light">Jumlah Kursi:</span>
                  <span className="text-light">{selectedSeats.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-light">Harga per Kursi:</span>
                  <span className="text-light">{formatCurrency(pricePerSeat)}</span>
                </div>
              </div>

              <hr className="border-secondary" />

              <div className="d-flex justify-content-between mb-3">
                <span className="text-light fw-bold">Total Harga:</span>
                <span className="text-warning fw-bold fs-5">
                  {formatCurrency(selectedSeats.length * pricePerSeat)}
                </span>
              </div>

              <button
                className="btn btn-warning w-100 fw-bold"
                onClick={handleCheckout}
                disabled={selectedSeats.length === 0}
              >
                Lanjut Checkout
              </button>
            </div>
          </div>

          <Link href="/" className="btn btn-outline-light w-100">
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <style jsx>{`
        .screen-indicator {
          height: 8px;
          background: linear-gradient(to bottom, #ffb84c, transparent);
          border-radius: 50% 50% 0 0;
          margin: 0 auto;
          max-width: 80%;
        }

        .seat-grid {
          max-width: 600px;
          margin: 0 auto;
        }

        .row-label {
          width: 30px;
          text-align: center;
          font-size: 14px;
        }

        .seat {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: none;
          font-size: 11px;
          font-weight: 600;
          transition: all 0.2s;
          cursor: pointer;
        }

        .seat.available {
          background: #2a2a2a;
          color: #999;
          border: 1px solid #444;
        }

        .seat.available:hover {
          background: #3a3a3a;
          border-color: #ffb84c;
          transform: scale(1.1);
        }

        .seat.selected {
          background: #ffb84c;
          color: #000;
          border: 1px solid #ffb84c;
          transform: scale(1.1);
        }

        .seat.booked {
          background: #dc3545;
          color: #fff;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .legend-box {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: inline-block;
        }

        .legend-box.available {
          background: #2a2a2a;
          border: 1px solid #444;
        }

        .legend-box.selected {
          background: #ffb84c;
        }

        .legend-box.booked {
          background: #dc3545;
        }
      `}</style>
    </div>
  );
}