import { Movie } from "@prisma/client";
import Link from "next/link";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="col-md-3">
      <div className="card bg-dark text-light mb-3">
        <Link href={`/movies/${movie.id}`}>
          <img src={movie.poster} className="card-img-top" alt={movie.title} />
        </Link>
        <div className="card-body">
          <h5 className="card-title">{movie.title}</h5>
          <p className="text-secondary">
            {movie.genre} • {movie.rating}
          </p>
        </div>
      </div>
    </div>
  );
}
