import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArchitStudio - C4 & Cloud Architecture Diagramming",
  description: "Professional tool for diagramming cloud architectures and C4 models",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}
