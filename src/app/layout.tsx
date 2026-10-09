import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Martinique Explorer — Le Guide & Réseau Communautaire de l'Île aux Fleurs",
  description: "Découvrez les plages paradisiaques de Martinique, spots de snorkeling avec tortues sans sargasses, carte interactive, mur social et conseils d'habitants.",
  keywords: "Martinique, plages Martinique, snorkeling tortues, sargasses direct, guide voyage, Les Salines, Anses d'Arlet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%22%20100%20100%22><text y=%22.9em%22 font-size=%2290%22>🌺</text></svg>" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 selection:bg-teal-500 selection:text-white">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
