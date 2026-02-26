import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aipack.live"),
  title: {
    default: "Никита Ефимов | AI Комьюнити",
    template: "%s | AI Комьюнити",
  },
  description: "Инструменты, шаблоны и курсы по AI-автоматизации для тех, кто хочет применять AI в работе и бизнесе.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "AI Комьюнити",
    title: "Никита Ефимов | AI Комьюнити",
    description: "Инструменты, шаблоны и курсы по AI-автоматизации для тех, кто хочет применять AI в работе и бизнесе.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Никита Ефимов | AI Комьюнити",
    description: "Инструменты, шаблоны и курсы по AI-автоматизации для тех, кто хочет применять AI в работе и бизнесе.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
