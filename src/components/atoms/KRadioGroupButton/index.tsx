import { Radio, RadioGroupProps } from "antd";
import React from "react";
import styles from "./styles.module.scss";
import { cn } from "@/utils";
import { RadioOptionTypeEnum } from "@/constants";

interface KRadioGroupButtonProps extends RadioGroupProps {
  className?: string;
  optionType?: RadioOptionTypeEnum;
}

export default function KRadioGroupButton({
  className,
  optionType = RadioOptionTypeEnum.BUTTON,
  ...props
}: KRadioGroupButtonProps) {
  return (
    <Radio.Group
      optionType={optionType}
      className={cn(
        styles.container,
        optionType === RadioOptionTypeEnum.BUTTON && styles.border,
        className
      )}
      {...props}
    />
  );
}
