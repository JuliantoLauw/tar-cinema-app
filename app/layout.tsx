import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "./navbar";
import Footer from "./footer";

export const metadata = { title: "TARCinema" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-dark text-light">
        <Navbar />
        <main className="container py-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
