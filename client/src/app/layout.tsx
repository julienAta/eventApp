import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getUser } from "@/lib/authService";

export const metadata: Metadata = {
  title: "JUNBI",
  description: "A simple event manager app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <ReactQueryProvider>
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className={GeistMono.className}>
          <main>
            <Navbar user={user} />
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </ReactQueryProvider>
  );
}
