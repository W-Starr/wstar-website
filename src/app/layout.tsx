import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import MarketingShell from "@/components/MarketingShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
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
      <body className={`${inter.variable} ${montserrat.variable} font-sans`}>
        <MarketingShell>{children}</MarketingShell>
      </body>
    </html>
  );
}
