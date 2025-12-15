import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Latam Buildathon",
  description:
    "A high-energy buildathon for founders, hackers, and designers across Latin America. Ship something real in days and launch faster.",
  applicationName: "Latam Buildathon",
  keywords: [
    "LATAM",
    "buildathon",
    "hackathon",
    "startup",
    "Next.js",
    "React",
    "TypeScript",
  ],
  openGraph: {
    title: "Latam Buildathon",
    description:
      "Build in public with LATAM’s fastest builders. Ship something real in days and launch faster.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
