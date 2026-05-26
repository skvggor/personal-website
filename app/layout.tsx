import type { Metadata } from "next";
import { DM_Mono, Shippori_Mincho, VT323 } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { LanguageProvider } from "@/lib/i18n/context";
import { TransitionProvider } from "@/lib/transition/context";
import "./globals.css";

const dmMono = DM_Mono({ subsets: ["latin"], weight: "300" });
const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
});
const shipporiMincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-shippori",
});

const siteUrl = "https://skvggor.dev";
const title = "Marcos Lima — Software Developer";
const description =
  "Father of two, software developer, skateboarder, fixed gear cyclist and music collector based in Brazil.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "Marcos Lima",
    "skvggor",
    "software developer",
    "frontend",
    "React",
    "Next.js",
    "TypeScript",
    "skateboarder",
    "fixed gear",
    "cyclist",
    "Brazil",
  ],
  authors: [{ name: "Marcos Lima", url: siteUrl }],
  creator: "Marcos Lima",
  icons: {
    icon: "/favicon.svg",
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    siteName: "Marcos Lima (skvggor)",
    locale: "pt_BR",
    url: siteUrl,
    title,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Marcos Lima — skvggor.dev — おまかせ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@skvggor",
    creator: "@skvggor",
    title,
    description,
    images: "/og-image.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marcos Lima",
  alternateName: "skvggor",
  url: siteUrl,
  image: `${siteUrl}/profile.jpg`,
  jobTitle: "Software Developer",
  description,
  sameAs: [
    "https://github.com/skvggor",
    "https://www.linkedin.com/in/marcker",
    "https://youtube.com/@skvggor",
    "https://www.strava.com/athletes/18616728",
  ],
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${dmMono.className} ${vt323.variable} ${shipporiMincho.variable}`}
      >
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TransitionProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </TransitionProvider>
      </body>
    </html>
  );
}
