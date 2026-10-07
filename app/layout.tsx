import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "ClinicDesk OPD — Outpatient Department System",
  description:
    "Outpatient registration, real-time appointment scheduling, and doctor consultation charting workstation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50/60 text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
        <Suspense
          fallback={
            <header className="sticky top-0 z-40 h-14 border-b border-slate-200 bg-white/95 backdrop-blur-sm" />
          }
        >
          <Navbar />
        </Suspense>

        {children}
      </body>
    </html>
  );
}