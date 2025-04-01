import { KLogo, KText } from "@/components/atoms";
import React from "react";

export default function AuthFormTitle() {
  return (
    <div className="flex flex-col items-center gap-5">
      <KLogo />
      <KText className="s2-heading uppercase">Đăng nhập</KText>
    </div>
  );
}
