"use client";

import { cn } from "@/utils";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import React from "react";

interface KButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

const KButton: React.FC<KButtonProps> = ({ className, children, ...rest }) => {
  return (
    <Button {...rest} className={cn("sbody-code", className)}>
      {children}
    </Button>
  );
};

export default KButton;
