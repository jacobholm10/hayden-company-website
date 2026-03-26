import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageViewTracker from "@/components/PageViewTracker";
import MobileCallBar from "@/components/MobileCallBar";
import { CONTACT } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://finnsfamilymoving.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Finn's Family Moving | Local Moving & Junk Removal",
  description:
    "Your trusted local moving and junk removal service in the Twin Cities. Family-owned and operated. Get a free quote today!",
  openGraph: {
    title: "Finn's Family Moving | Local Moving & Junk Removal",
    description:
      "Your trusted local moving and junk removal service in the Twin Cities. Family-owned and operated. Get a free quote today!",
    url: BASE_URL,
    siteName: "Finn's Family Moving",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/photos/carrying-couch.jpg",
        width: 1200,
        height: 630,
        alt: "Finn's Family Moving team carrying furniture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finn's Family Moving | Local Moving & Junk Removal",
    description:
      "Your trusted local moving and junk removal service in the Twin Cities. Family-owned and operated. Get a free quote today!",
    images: ["/photos/carrying-couch.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  name: "Finn's Family Moving",
  description:
    "Professional local moving and junk removal services in the Twin Cities metropolitan area. Family-owned and operated.",
  url: BASE_URL,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  priceRange: "$$",
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 44.9778,
      longitude: -93.265,
    },
    geoRadius: "50",
    description: "Twin Cities metropolitan area",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "07:00",
    closes: "19:00",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-grow pb-16 md:pb-0">{children}</main>
        <Footer />
        <PageViewTracker />
        <MobileCallBar />
      </body>
    </html>
  );
}
