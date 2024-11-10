import type { Metadata } from "next";
import { Anek_Latin } from "next/font/google";
import "./globals.css";

const anekLatin = Anek_Latin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add the weights you want to include
  style: ["normal"], // You can include 'italic' if needed
});

export const metadata: Metadata = {
  title: "Molecule Viewer",
  description: "App to transform and view molecules in 3D. By Bram Geboers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={anekLatin.className}>{children}</body>
    </html>
  );
}
