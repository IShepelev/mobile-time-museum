import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mobile Time Museum",
    template: "%s · Mobile Time Museum",
  },
  description:
    "A digital museum preserving the evolution of mobile phones — travel through years, brands, and individual exhibits.",
  openGraph: {
    title: "Mobile Time Museum",
    description: "Travel through the history of mobile phones.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
