import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ScrollToTop from "@/components/layout/ScrollToTop";
import GlobalModals from "@/components/modals/GlobalModals";

export const metadata: Metadata = {
  title: "Martinique Explorer — Le Guide & Réseau Communautaire de l'Île aux Fleurs",
  description: "Découvrez les plages paradisiaques de Martinique, spots de snorkeling avec tortues sans sargasses, carte interactive, mur social et conseils d'habitants.",
  keywords: "Martinique, plages Martinique, snorkeling tortues, sargasses direct, guide voyage, Les Salines, Anses d'Arlet",
  authors: [{ name: "Martinique Explorer Team" }],
  creator: "Martinique Explorer",
  publisher: "Martinique Explorer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Martinique Explorer — Le Guide & Réseau Communautaire",
    description: "Le meilleur guide interactif pour préparer votre voyage en Martinique. Spots secrets, météo, sargasses en direct et communauté locale.",
    url: "https://martinique-explorer.com",
    siteName: "Martinique Explorer",
    images: [
      {
        url: "/images/spots/salines.jpg", // Make sure this image exists or provide a default OG image
        width: 1200,
        height: 630,
        alt: "Les Salines - Martinique Explorer",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Martinique Explorer — Guide de Voyage",
    description: "Le meilleur guide interactif pour préparer votre voyage en Martinique.",
    creator: "@mqexplorer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/icon.svg',
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 selection:bg-teal-500 selection:text-white">
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <AppProvider>
          {children}
          <GlobalModals />
        </AppProvider>
      </body>
    </html>
  );
}
