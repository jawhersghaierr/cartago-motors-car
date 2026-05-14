import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Cartago Motors — Voitures Premium Export Tunisie Algérie Maroc",
  description:
    "Spécialiste export de véhicules premium vers la Tunisie, l'Algérie et le Maroc. Catalogue exclusif de voitures d'occasion haut de gamme.",
  keywords:
    "voiture export tunisie, voiture export algerie, voiture export maroc, automobile maghreb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-carbon-950 text-white antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid rgba(212,146,26,0.3)",
            },
            success: { iconTheme: { primary: "#d4921a", secondary: "#000" } },
          }}
        />
      </body>
    </html>
  );
}
