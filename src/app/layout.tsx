import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import config from "../config/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Post.it",
  description: config.GNO_POSTIT_REALM,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
