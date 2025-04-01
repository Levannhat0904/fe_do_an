"use client";

import { KButton, KText } from "@/components/atoms";
import { colors, DrawerEnum } from "@/constants";
import { useDisclosure } from "@/contexts/DisclosureContext";
import { FunnelSimple } from "@phosphor-icons/react";
import React from "react";

export default function FilterButton() {
  const drawer = useDisclosure();
  return (
    <KButton
      onClick={() => drawer?.openPopup(DrawerEnum.filter)}
      type="text"
      className="flex items-center gap-[2px] !px-0 hover:!bg-transparent"
    >
      <FunnelSimple size={20} color={colors.black} />
      <KText className="sbody-code text-sdark2">Bộ lọc</KText>
    </KButton>
  );
}
