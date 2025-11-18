import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) return <p>Film tidak ditemukan.</p>;

  return (
    <div className="row mt-4">
      <div className="col-md-4">
        <img src={`/${movie.poster}`} className="img-fluid rounded" alt={movie.title} />
      </div>

      <div className="col-md-8">
        <h2 className="text-warning">{movie.title}</h2>
        <p className="mb-3">
          <span className="badge bg-secondary me-2">{movie.genre}</span>
          <span className="badge bg-secondary me-2">{movie.rating}</span>
          <span className="badge bg-secondary">{movie.duration}</span>
        </p>
        
        <h5 className="text-warning mt-4">Sinopsis</h5>
        <p className="text-light">{movie.synopsis}</p>

        <h5 className="text-warning mt-4">Sutradara</h5>
        <p className="text-light">{movie.director}</p>

        <h5 className="text-warning mt-4">Aktor</h5>
        <p className="text-light">{movie.actors}</p>

        <h5 className="text-warning mt-4">Trailer</h5>
        {movie.trailer ? (
          <div className="ratio ratio-16x9 mb-4">
            <iframe 
              src={movie.trailer} 
              allowFullScreen
              title={`${movie.title} Trailer`}
            ></iframe>
          </div>
        ) : (
          <p className="text-muted">Tidak ada trailer</p>
        )}

        <Link 
          href={`/seat-selection?movie=${id}`} 
          className="btn btn-warning btn-lg mt-3 px-5"
        >
          <i className="bi bi-ticket-perforated me-2"></i>
          Beli Tiket
        </Link>
      </div>
    </div>
  );
}