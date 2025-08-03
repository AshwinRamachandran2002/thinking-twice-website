import type { Metadata } from "next";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";

export const metadata: Metadata = {
  title: "ContextFort",
  description: "AI-powered architectural drawing review for construction teams",
  icons: {
    icon: "/contextfort-logo.png",
    shortcut: "/contextfort-logo.png",
    apple: "/contextfort-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />{children}</body>
    </html>
  );
}
