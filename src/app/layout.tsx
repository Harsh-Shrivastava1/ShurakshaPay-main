import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "SurakshaPay – AI Income Shield for Gig Workers",
  description: "AI-powered parametric insurance that protects gig workers from income loss due to weather events.",
  keywords: ["gig workers", "insurance", "AI", "income protection", "parametric insurance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className="antialiased bg-gray-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
