import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `${siteConfig.productName} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.productName}`,
  },
  description:
    "Send bulk SMS in Kenya over a direct SMPP connection to the MNO — no aggregator hop, no aggregator markup. CAK-compliant sender-ID governance, real-time delivery reports, and a prepaid wallet built for local businesses.",
  keywords: [
    "bulk SMS Kenya",
    "SMPP Kenya",
    "Safaricom SMS API",
    "A2P messaging Kenya",
    "SMS gateway Kenya",
    "CAK compliant SMS",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteConfig.domain,
    siteName: siteConfig.productName,
    title: `${siteConfig.productName} — ${siteConfig.tagline}`,
    description:
      "Direct SMPP connection to the MNO. No aggregator hop. CAK-compliant, Kenya-built bulk SMS.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.productName} — ${siteConfig.tagline}`,
    description:
      "Direct SMPP connection to the MNO. No aggregator hop. CAK-compliant, Kenya-built bulk SMS.",
  },
  alternates: {
    canonical: siteConfig.domain,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.companyName,
    url: siteConfig.domain,
    email: siteConfig.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.streetAddress,
      addressLocality: siteConfig.addressLocality,
      addressCountry: siteConfig.addressCountry,
    },
    description:
      "Direct-to-carrier bulk SMS platform for the Kenyan market, connecting over SMPP straight to the MNO SMSC.",
  };

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.productName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "A directly-operated bulk SMS platform connecting over SMPP to the MNO SMSC (Safaricom first, Airtel/Telkom extensible), with a REST API, delivery reporting, prepaid wallet, and CAK-compliant sender-ID governance.",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
    },
  };

  return (
    <html lang="en-KE">
      <body className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
        />
        {children}
      </body>
    </html>
  );
}