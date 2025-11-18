import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "./navbar";
import Footer from "./footer";

export const metadata = { title: "TARCinema" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body className="bg-dark text-light">
        <Navbar />
        <main className="container py-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}