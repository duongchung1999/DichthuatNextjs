import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/assets/css/DichthuatHandle.css"
import "@/assets/css/DichthuatViewer.css"
import "@/assets/css/ItemCard.css"
import "@/assets/css/LikedView.css"
import "@/assets/css/Login.css"
import "@/assets/css/MenuSide.css"
import "@/assets/css/NavHeader.css"
import "@/assets/css/PageForm.css"
import "@/assets/css/WaitingLoad.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Học Dịch Chữ Hán",
  description: "Trang web học tập và luyện dịch chữ Hán",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
