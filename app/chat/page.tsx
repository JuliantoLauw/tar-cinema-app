"use client";

import { useState, useRef, FormEvent } from "react";
import Link from "next/link";

type FAQ = {
  question: string;
  answer: string;
  keywords: string[];
};

type ChatItem = {
  user: string;
  text: string;
  isBot?: boolean;
  withButton?: boolean;
};

const chatData: { chats: FAQ[] } = {
  chats: [
    {
      question: "Bagaimana cara membeli tiket?",
      answer:
        "Pilih film => klik 'Beli Tiket' => pilih bioskop, tanggal, jam, kursi => checkout pembayaran.",
      keywords: ["beli", "pesan", "booking"],
    },
    {
      question: "Bagaimana cara menggunakan voucher?",
      answer:
        "Masukkan kode voucher di halaman checkout. Jika valid, total harga akan terpotong.",
      keywords: ["voucher", "diskon", "promo"],
    },
    {
      question: "Apakah saya bisa refund tiket?",
      answer: "Mohon maaf, tiket yang sudah dibeli tidak dapat direfund.",
      keywords: ["refund", "kembalikan", "uang", "batal"],
    },
    {
      question: "Bagaimana cara melihat riwayat pembelian?",
      answer:
        "Klik menu 'Riwayat' di navigasi. Semua tiket yang Anda pesan akan tampil di sana.",
      keywords: ["riwayat", "history", "pembelian", "pesanan"],
    },
    {
      question: "Berapa harga tiket?",
      answer:
        "Harga tiket standar Rp 50.000 per kursi. Promo tertentu bisa berbeda.",
      keywords: ["harga", "biaya", "bayar", "tiket"],
    },
    {
      question: "Bagaimana cara memilih kursi?",
      answer:
        "Setelah pilih film & jadwal, Anda akan diarahkan ke halaman denah kursi. Klik kursi yang masih tersedia.",
      keywords: ["kursi", "seat", "tempat duduk"],
    },
  ],
};

export default function ChatPage() {
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"" | "report" | "feedback">("");
  const [popupText, setPopupText] = useState("");
  const [showThanks, setShowThanks] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const chatRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, 60);
  };

  const addMessage = (msg: ChatItem) => {
    setChat((prev) => [...prev, msg]);
    scrollBottom();
  };

  const botReply = (text: string) => {
    const lower = text.toLowerCase();

    if (/halo|hai|hi|hallo|hei/i.test(lower)) {
      return setTimeout(
        () => addMessage({ user: "Bot", text: "Halo! Ada yang bisa saya bantu?", isBot: true }),
        800
      );
    }

    const match = chatData.chats.find((item) =>
      item.keywords.some((k) => lower.includes(k))
    );

    const reply = match ? match.answer : null;

    setTimeout(() => {
      addMessage({
        user: "Bot",
        text:
          reply ??
          "Maaf, saya tidak mengerti pertanyaan Anda. Silakan hubungi Customer Service langsung.",
        isBot: true,
        withButton: !reply,
      });
    }, 1000);
  };

  const sendChat = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    const uname = username.trim() || "Anda";
    addMessage({ user: uname, text: message });
    const userMsg = message;
    setMessage("");

    setTimeout(() => botReply(userMsg), 600);
  };

  const openPopup = (type: "report" | "feedback") => {
    setPopupType(type);
    setPopupText("");
  };

  const submitPopup = () => {
    if (!popupText.trim()) return alert("Harap isi sebelum mengirim!");
    setPopupType("");
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 2000);
  };

  return (
    <div className="chat-container">
      <h2>Chatbox</h2>
      <div className="chat-box" ref={chatRef} style={{ fontSize }}>
        {chat.map((c, i) => (
          <div key={i} className={`chat-msg ${c.isBot ? "chat-bot" : "chat-user"}`}>
            <strong>{c.user}:</strong> {c.text}
            {c.withButton && (
              <Link className="faq-btn" href="/support">Hubungi CS</Link>
            )}
          </div>
        ))}

        {chat.length === 0 && (
          <div className="chat-msg chat-bot">
            Halo! Pilih pertanyaan populer:
            {chatData.chats.map((item, index) => (
              <button
                key={index}
                className="faq-btn"
                onClick={() => {
                  addMessage({ user: "Anda", text: item.question });
                  setTimeout(() => addMessage({ user: "Bot", text: item.answer, isBot: true }), 600);
                }}
              >
                {item.question}
              </button>
            ))}
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={sendChat}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nama Anda"
        />
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pertanyaan..."
        />
        <button type="submit">Kirim</button>
      </form>

      <div className="extra-actions">
        <button id="reportIssueBtn" onClick={() => openPopup("report")}>Ajukan Kendala</button>
        <button id="feedbackBtn" onClick={() => openPopup("feedback")}>Berikan Feedback</button>
      </div>

      {popupType && (
        <div className="popup">
          <div className="popup-content">
            <h3>{popupType === "report" ? "Ajukan Kendala" : "Feedback"}</h3>
            <textarea value={popupText} onChange={(e) => setPopupText(e.target.value)} />
            <div className="popup-actions">
              <button onClick={submitPopup}>Kirim</button>
              <button onClick={() => setPopupType("")}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {showThanks && (
        <div className="popup">
          <div className="popup-content">
            <h3>Terima Kasih</h3>
            <p>Pesan Anda sudah terkirim.</p>
          </div>
        </div>
      )}

      <div className="controls">
        Font:{" "}
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
