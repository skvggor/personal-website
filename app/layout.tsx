import type { Metadata } from "next";
import { DM_Mono, VT323 } from "next/font/google";
import type { ReactNode } from "react";

import AnnouncementBar from "@/components/announcementBar/announcementBar";
import { getAnnouncementBarConfig } from "@/lib/announcement";
import "./globals.css";

const dmMono = DM_Mono({ subsets: ["latin"], weight: "300" });
const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trve.in"),
  title:
    "Marcos Lima (skvggor) - Father, Sk8boarder, Music collector, Street runner, Cyclist & Senior SW dev.",
  description:
    "Father of two wonderful girls • Sk8boarder • Music collector • Street runner • Cyclist #fixedgear • Linux since 2009 • Senior SW dev at @radixeng",
  openGraph: {
    type: "website",
    siteName: "Marcos Lima (skvggor)",
    locale: "pt_BR",
    url: "https://trve.in",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Marcos Lima (skvggor) - Father of two wonderful girls, Sk8boarder, Music collector, Street runner, Cyclist & Senior SW dev.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@skvggor",
    title:
      "Marcos Lima (skvggor) - Father, Sk8boarder, Music collector, Street runner, Cyclist & Senior SW dev.",
    description:
      "Father of two wonderful girls • Sk8boarder • Music collector • Street runner • Cyclist #fixedgear • Linux since 2009 • Senior SW dev",
    images: "/og-image.png",
  },
};

export default async function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const announcementConfig = await getAnnouncementBarConfig();

  return (
    <html lang="pt-BR">
      <body className={`${dmMono.className} ${vt323.variable}`}>
        <AnnouncementBar config={announcementConfig} />
        {children}
      </body>
    </html>
  );
}
