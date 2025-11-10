import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Movie } from "@prisma/client";

type MovieCardProps = {
  movie: Movie;
};

function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="col-md-3 mb-4">
      <div className="card bg-dark text-light h-100">
        <Link href={`/movies/${movie.id}`}>
          <img
            src={movie.poster}
            className="card-img-top"
            alt={movie.title}
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title">{movie.title}</h5>
          <p className="text-secondary">
            {movie.genre} • {movie.rating}
          </p>
          {movie.trailer && (
            <a
              href={movie.trailer}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-light"
            >
              Watch Trailer
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const movies = await prisma.movie.findMany();

  const nowPlaying = movies.slice(0, 2);
  const comingSoon = movies.slice(2);

  return (
    <div className="container mt-4">
      <h2>Now Playing</h2>
      <div className="row">
        {nowPlaying.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>

      <h2 className="mt-5">Coming Soon</h2>
      <div className="row">
        {comingSoon.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  );
}
