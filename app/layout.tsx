import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { Noto_Sans } from "next/font/google";

export const noto_sans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Movie Connections",
  description: "Movie connections",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="sunset" className={noto_sans.className}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
