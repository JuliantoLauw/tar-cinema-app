"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-black px-4">
      <h1 className="navbar-brand text-warning">TARCinema</h1>

      <div>
        <Link href="/" className="me-3 text-light">Home</Link>
        <Link href="/movies" className="me-3 text-light">Film</Link>
      </div>
    </nav>
  );
}
