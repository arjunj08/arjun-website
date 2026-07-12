import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Living Book — Cinematic Interactive Learning",
  description: "A premium 3D interactive, film-like cosmic reading experience featuring orbital particle fields and smooth transitions.",
  authors: [{ name: "The Living Book Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
  }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${lora.variable} font-sans bg-[#050508] text-stone-100 antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
