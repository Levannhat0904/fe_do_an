import { cn } from "@/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function KText(
  props: Props & React.HTMLAttributes<HTMLSpanElement>
) {
  const { children, className, ...rest } = props;
  return (
    <span className={cn("text-characterPrimary85", className)} {...rest}>
      {children}
    </span>
  );
}
