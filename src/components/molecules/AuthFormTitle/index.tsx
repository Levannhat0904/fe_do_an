"use client";
import { KLogo, KText } from "@/components/atoms";
import { usePathname } from "next/navigation";
import React from "react";

export default function AuthFormTitle() {
  const pathname = usePathname();
  const isResetPassword = pathname.includes("dat-lai-mat-khau");
  const isForgotPassword = pathname.includes("quen-mat-khau");
  console.log(pathname);
  const title = isResetPassword
    ? "Đặt lại mật khẩu"
    : isForgotPassword
    ? "Quên mật khẩu"
    : "Đăng nhập";
  return (
    <div className="flex flex-col items-center gap-5">
      <KLogo />
      <KText className="s2-heading uppercase">{title}</KText>
    </div>
  );
}
