import "./globals.css";
import "./styles/mobile.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppProvider } from "./providers/app-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArchitStudio - C4 & Cloud Architecture Diagramming",
  description:
    "Professional tool for diagramming cloud architectures and C4 models. Create beautiful, professional diagrams with ease.",
  keywords: "architecture, diagrams, C4, cloud, AWS, GCP, Azure, diagramming tool",
  authors: [{ name: "ArchitStudio Team" }],
  creator: "ArchitStudio",
  openGraph: {
    title: "ArchitStudio - Professional Architecture Diagramming",
    description: "Create beautiful, professional architecture diagrams with ease",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchitStudio - Professional Architecture Diagramming",
    description: "Create beautiful, professional architecture diagrams with ease",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
