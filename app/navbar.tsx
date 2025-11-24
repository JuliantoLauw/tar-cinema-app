"use client";
import Link from "next/link";
import { useAuth } from "./providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-black px-4">
      <h1 className="navbar-brand text-warning">TARCinema</h1>

      <div className="d-flex align-items-center gap-3">
        <Link href="/" className="text-light" style={{ textDecoration: "none" }}>Home</Link>
        {user ? (
          <>
            <Link href="/history" className="text-light" style={{ textDecoration: "none" }}>Riwayat</Link>
            <Link href="/chat" className="text-light" style={{ textDecoration: "none" }}>Layanan</Link>
            
            <div className="dropdown" style={{ position: "relative" }}>
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ cursor: "pointer" }}
              >
                {user.name}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu show" style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  backgroundColor: "#1b1b1b",
                  border: "1px solid #ffb84c",
                  borderRadius: "4px",
                  minWidth: "150px",
                  zIndex: 1000,
                }}>
                  <div style={{
                    padding: "8px 16px",
                    color: "#b6b6b6",
                    fontSize: "12px",
                    borderBottom: "1px solid #333"
                  }}>
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "8px 16px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "0",
                      cursor: "pointer",
                      fontSize: "14px",
                      textAlign: "left"
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-sm btn-warning" style={{ textDecoration: "none" }}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
