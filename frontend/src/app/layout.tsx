import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Import the new client component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Institute Management Portal",
  description: "A comprehensive portal for managing institutes, students, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The Providers component now handles all client-side context */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

