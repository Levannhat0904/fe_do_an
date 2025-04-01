import { LOGO_SIDEBAR_URL } from "@/constants";
import Image from "next/image";
import React from "react";

export default function KLogoSidebar() {
  return (
    <Image
      src={LOGO_SIDEBAR_URL}
      className="w-[125px] max-h-14"
      alt="ktx-logo_sidebar"
      width={580}
      height={56}
    />
  );
}
