import "./globals.css";
import { Inter, Barlow_Condensed } from "next/font/google";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow",
});

export const metadata = {
  title: "Pitchside · Live Football Tracker",
  description: "Live scores, standings and your favourite teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${barlow.variable} min-h-screen font-sans antialiased`}>
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="py-8 text-center text-xs text-chalk/40">
          Data by football-data.org · Built with Next.js
        </footer>
      </body>
    </html>
  );
}