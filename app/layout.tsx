import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "เงินดี — ผู้ช่วยดูแลบัญชีส่วนบุคคล",
  description: "จัดการรายรับ รายจ่าย งบประมาณ หนี้ เงินออม การลงทุน และภาษีในที่เดียว",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}
