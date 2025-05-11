import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./(root)/globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quản lý KTX",
  description: "Quản lý KTX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
