import { LOGO_URL } from "@/constants";
import Image from "next/image";
import React from "react";

export default function KLogo() {
  return (
    <Image
      className="w-32 h-16"
      src={LOGO_URL}
      alt="ktx-logo"
      width={122}
      height={64}
    />
  );
}
