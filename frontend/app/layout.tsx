import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Myndra Radiology",
  description: "Radiology Diagnostic Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
