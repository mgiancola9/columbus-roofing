import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTARoofingEstimates.ca — Instant Roof Estimates for GTA Homeowners",
  description:
    "Get a free, accurate roofing estimate for your Toronto, Mississauga, Brampton or GTA home in under 60 seconds. No sales pressure. Connect with licensed local contractors.",
  keywords:
    "roofing estimate Toronto, roof replacement GTA, roofing contractor Mississauga, roof cost calculator Ontario",
  openGraph: {
    title: "GTARoofingEstimates.ca — Instant Roof Estimates",
    description:
      "Get a free roofing estimate for your GTA home in under 60 seconds.",
    url: "https://gtaroofingestimates.ca",
    siteName: "GTARoofingEstimates.ca",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-CA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
