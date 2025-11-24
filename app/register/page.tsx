"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (pwd: string) => {
    // Minimal 8 karakter, kombinasi angka dan huruf besar
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasMinLength = pwd.length >= 8;
    return hasUpper && hasNumber && hasMinLength;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi
    if (!name || !email || !password || !confirmPassword) {
      setError("Semua field harus diisi");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email tidak valid");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password harus minimal 8 karakter dengan kombinasi huruf besar dan angka");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registrasi gagal");
        return;
      }

      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError("Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = validatePassword(password);

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card">
          <h1 className="register-title">TARCinema</h1>
          <h2 className="register-subtitle">Daftar</h2>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {success && <div className="alert alert-success" role="alert">{success}</div>}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nama</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Masukkan nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Masukkan password (min. 8 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="password-requirement">
                <div className={isPasswordValid && password.length >= 8 ? "valid" : "invalid"}>
                  ✓ Minimal 8 karakter
                </div>
                <div className={/[A-Z]/.test(password) ? "valid" : "invalid"}>
                  ✓ Mengandung huruf besar (A-Z)
                </div>
                <div className={/[0-9]/.test(password) ? "valid" : "invalid"}>
                  ✓ Mengandung angka (0-9)
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Konfirmasi Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Konfirmasi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 fw-bold"
              disabled={loading || !isPasswordValid}
            >
              {loading ? "Loading..." : "Daftar"}
            </button>
          </form>

          <hr className="my-4" />

          <p className="text-center">
            Sudah punya akun?{" "}
            <Link href="/login" className="link-warning fw-bold">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
