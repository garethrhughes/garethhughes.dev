import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://garethhughes.dev"),
  title: { default: "Gareth Hughes", template: "%s - Gareth Hughes" },
  description: "Thoughts on software engineering, leadership, and technology.",
  keywords: ["software engineering", "engineering leadership", "technology", "blog"],
  authors: [{ name: "Gareth Hughes", url: "https://garethhughes.dev" }],
  creator: "Gareth Hughes",
  icons: {
    icon: "/avatar.jpeg",
    apple: "/avatar.jpeg",
  },
  openGraph: {
    type: "website",
    siteName: "Gareth Hughes",
    title: "Gareth Hughes",
    description: "Thoughts on software engineering, leadership, and technology.",
    url: "https://garethhughes.dev",
    images: [{ url: "/avatar.jpeg", alt: "Gareth Hughes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gareth Hughes",
    description: "Thoughts on software engineering, leadership, and technology.",
    images: ["/avatar.jpeg"],
  },
  alternates: {
    canonical: "https://garethhughes.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('gh-theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
