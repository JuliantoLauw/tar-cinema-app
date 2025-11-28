"use client";

import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!user) return <p className="text-center mt-5">Harap login dahulu.</p>;

  // Update profil (nama/email/photo)
  const updateProfile = async () => {
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, name, email, photoUrl }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) login(data.user);
  };

  // Ganti password
  const changePassword = async () => {
    const res = await fetch("/api/user/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, oldPassword, newPassword }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);

    if (res.ok) {
      setOldPassword("");
      setNewPassword("");
    }
  };

  // Upload foto profil
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/user/upload-photo", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setPhotoUrl(data.url);
      login({ ...user, photoUrl: data.url });
      setMessage("Foto profil berhasil diperbarui!");
    } else {
      setMessage(data.error || "Gagal upload foto");
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "30px auto",
      padding: "20px",
      backgroundColor: "#111",
      color: "#fff",
      borderRadius: "10px",
      textAlign: "center"
    }}>
      <h2 style={{ marginBottom: "20px" }}>Profil Pengguna</h2>

      {message && <div style={{
        backgroundColor: "#ffc107",
        color: "#000",
        padding: "5px 10px",
        borderRadius: "5px",
        marginBottom: "15px"
      }}>{message}</div>}

      {/* Foto Profil */}
      <div style={{ marginBottom: "20px" }}>
        <img
          src={photoUrl || "/default-avatar.png"}
          alt="profile"
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }}
        />
        <br />
        <input type="file" id="uploadPic" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
        <button
          onClick={() => document.getElementById("uploadPic")?.click()}
          style={{
            backgroundColor: "#ffc107",
            border: "none",
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            margin: "0 auto"
          }}
        >
          <i className="fa-solid fa-camera"></i> Ganti Foto
        </button>
      </div>

      {/* Info Nama & Email */}
      <div className="info" style={{ marginBottom: "20px", textAlign: "left" }}>
        <p><strong>Nama:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
      </div>

      {/* Form Update Profil */}
      <form onSubmit={(e) => { e.preventDefault(); updateProfile(); }} style={{ textAlign: "left" }}>
        <label>Nama Baru</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "8px", margin: "5px 0 15px", borderRadius: "5px" }} />
        <label>Email Baru</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "8px", margin: "5px 0 15px", borderRadius: "5px" }} />
        <button type="submit" style={{
          padding: "10px 15px",
          backgroundColor: "#ffc107",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%"
        }}>
          <i className="fa-solid fa-rotate"></i> Simpan Perubahan
        </button>
      </form>

      {/* Form Ganti Password */}
      <div style={{ marginTop: "20px", textAlign: "left" }}>
        <label>Password Lama</label>
        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px" }} />
        <label>Password Baru</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px" }} />
        <button onClick={changePassword} style={{
          marginTop: "10px",
          padding: "10px 15px",
          backgroundColor: "#dc3545",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          color: "#fff",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}>
          <i className="fa-solid fa-key"></i> Ubah Password
        </button>
      </div>
    </div>
  );
}
