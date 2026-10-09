import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Martinique Explorer — Le Guide & Réseau Communautaire de l'Île aux Fleurs",
  description: "Découvrez les plages paradisiaques de Martinique, spots de snorkeling avec tortues sans sargasses, carte interactive, mur social et conseils d'habitants.",
  keywords: "Martinique, plages Martinique, snorkeling tortues, sargasses direct, guide voyage, Les Salines, Anses d'Arlet",
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
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 selection:bg-teal-500 selection:text-white">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
