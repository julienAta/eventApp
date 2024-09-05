import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AuthWrapper } from "@/components/AuthWrapper";

export const metadata: Metadata = {
  title: "Event Manager",
  description: "A simple event manager app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className={GeistMono.className}>
          <AuthWrapper>
            <main>
              <Navbar />
              {children}
            </main>
            <Toaster />
          </AuthWrapper>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
