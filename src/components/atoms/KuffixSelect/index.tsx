import { cn } from "@/utils";
import { FormInstance, Select, SelectProps } from "antd";
import React, { FC } from "react";
import styles from "./styles.module.scss";

type Props = SelectProps & {
  form?: FormInstance;
  name?: string;
  customClassName?: string;
};

const SuffixSelect: FC<Props> = ({ customClassName, ...rest }) => {
  const commonClassName = cn(
    "px-2 py-[1px] !bg-white-20 rounded-3xl border-[0.5px] border-white-60",
    "hover:!bg-white-20 hover:!border-primary-6",
    "focus:!bg-white-20 focus-within:!bg-white-20 focus:!border-primary-6 focus-within:!border-primary-6",
    "font-averta text-sm font-normal leading-[22px]",
    "placeholder:font-averta placeholder:text-sm placeholder:font-normal placeholder:leading-[22px]",
    customClassName,
    styles.container
  );

  return (
    <div
      className={`${styles.root} w-full`}
      onClick={(event) => event.stopPropagation()}>
      <Select className={commonClassName} {...rest} />
    </div>
  );
};

export default SuffixSelect;
