import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Secure Code Editor | Safe Online Code Sharing",
    template: "%s | Secure Code Editor"
  },
  description: "A secure, privacy-focused online code editor and sharing platform with syntax highlighting, multiple language support, and robust security features.",
  keywords: ["code editor", "online coding", "syntax highlighting", "secure coding", "code sharing", "programming"],
  authors: [{ name: "Secure Code Editor Team" }],
  creator: "Secure Code Editor",
  publisher: "Secure Code Editor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.BETTER_AUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Secure Code Editor",
    description: "A secure, privacy-focused online code editor and sharing platform",
    siteName: "Secure Code Editor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Secure Code Editor",
    description: "A secure, privacy-focused online code editor and sharing platform",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
