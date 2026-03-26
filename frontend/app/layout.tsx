import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cueforth",
  description: "Cueforth helps students turn course chaos into a plan. PanicButton turns syllabi into reviewable deadlines.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} h-full bg-background text-foreground`}
        style={{ minHeight: "100%", background: "#0a0f1c", color: "#f3f4f6" }}
      >
        {children}
      </body>
    </html>
  );
}
