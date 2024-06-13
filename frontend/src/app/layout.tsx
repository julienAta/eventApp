import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Navbar } from "@/components/component/navbar";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/sonner";
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
      <html lang="en">
        <body className={inter.className}>
          <main>
            <Navbar />
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </ReactQueryProvider>
  );
}
