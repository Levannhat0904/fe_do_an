"use client";

import React from "react";
import StudentLayout from "@/components/pages/sinh-vien/layout";

export default function StudentRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentLayout>{children}</StudentLayout>;
}
