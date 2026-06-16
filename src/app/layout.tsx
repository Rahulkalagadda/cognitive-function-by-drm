import type { Metadata, Viewport } from "next";
import Toaster from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cognitive Assessment Platform (CAP)",
  description: "Premium clinical neuropsychology cognitive assessment platform and diagnostics dashboard.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CAP"
  },
  icons: {
    apple: "/icons/icon-192.png",
    shortcut: "/icons/icon-192.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563EB",
  viewportFit: "cover"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="antialiased bg-surface-page text-on-surface select-none md:select-text">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

