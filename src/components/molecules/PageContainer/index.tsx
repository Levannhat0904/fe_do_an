import { KText } from "@/components/atoms";
import { cn } from "@/utils";
import React from "react";

export default function PageContainer({
  title,
  children,
  className,
  hideTitle,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  hideTitle?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {!hideTitle && <KText className="s3-semibold text-black">{title}</KText>}
      {children}
    </div>
  );
}
