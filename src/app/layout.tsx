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
  metadataBase: new URL("https://wstartech.ng"),
  title: "WSTAR — Enterprise AI, EdTech & AgriTech Engineering",
  description:
    "WSTAR Technologies engineers deterministic AI Solutions for industrial B2B workflows, alongside Ace-Acad (EdTech) and PlantIQ (AgriTech) — built in Nigeria, engineered to global standards.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WSTAR Technologies Ltd",
  alternateName: "WSTAR",
  url: "https://wstartech.ng",
  logo: "https://wstartech.ng/images/wstar-logo-light.png",
  description:
    "WSTAR Technologies engineers deterministic AI Solutions for industrial B2B workflows, alongside Ace-Acad (EdTech) and PlantIQ (AgriTech).",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Zaria",
    addressRegion: "Kaduna State",
    addressCountry: "NG",
  },
  sameAs: [
    "https://www.linkedin.com/company/wstartech",
    "https://www.facebook.com/share/1bxic7RcTT/",
    "https://www.instagram.com/wstar_1",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <MarketingShell>{children}</MarketingShell>
      </body>
    </html>
  );
}
