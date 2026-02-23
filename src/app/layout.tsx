import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "WSTAR — Empowering Africa. Engineering the Future.",
  description:
    "WSTAR is a youth-led technology company building impactful EdTech and AgriTech solutions for Africa. Discover Ace-Acad and PlantIQ.",
  keywords: [
    "WSTAR",
    "EdTech",
    "AgriTech",
    "Nigeria",
    "Ace-Acad",
    "PlantIQ",
    "African Innovation",
    "Smart Farming",
    "Study App",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${roboto.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
