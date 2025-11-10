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
        <img src={movie.poster} className="img-fluid rounded" />
      </div>

      <div className="col-md-8">
        <h2>{movie.title}</h2>
        <p>
          <strong>{movie.genre}</strong> • {movie.rating} • {movie.duration}
        </p>
        <p>{movie.synopsis}</p>

        <h4>Sutradara</h4>
        <p>{movie.director}</p>

        <h4>Aktor</h4>
        <p>{movie.actors}</p>

        <h4>Trailer</h4>
        {movie.trailer ? (
          <iframe width="100%" height="320" src={movie.trailer} allowFullScreen></iframe>
        ) : (
          <p>Tidak ada trailer</p>
        )}

        <Link href={`/seat-selection?movie=${id}`} className="btn btn-success mt-3">
            Beli Tiket
        </Link>
      </div>
    </div>
  );
}
