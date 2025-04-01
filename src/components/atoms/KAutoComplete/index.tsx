"use client";
import React, { FC, useCallback, useState } from "react";
import { FormInstance, AutoComplete, AutoCompleteProps } from "antd";

import { cn } from "@/utils";
import styles from "./styles.module.scss";

type Props = AutoCompleteProps & {
  form?: FormInstance;
  name?: string;
  customOnChange?: (value: any, form?: FormInstance) => void;
};

const KAutoComplete: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const commonClassName = cn(
    "px-3 py-2 !bg-black-30 rounded-3xl border-[0.5px] border-white-10 h-12",
    "hover:!bg-black-30 hover:!border-primary-6",
    "focus:!bg-black-30 focus-within:!bg-black-30 focus:!border-primary-6 focus-within:!border-primary-6",
    "font-averta text-sm font-normal leading-[22px] text-white",
    "placeholder:font-averta placeholder:text-sm placeholder:font-normal placeholder:leading-[22px] placeholder:text-white",
    styles.container
  );

  const handleSelect = useCallback(
    (value: any, option: any) => {
      props?.onSelect?.(value, option);

      props?.customOnChange?.(value, props?.form);
    },
    [props]
  );

  return (
    <div className={`${styles.root} w-full`}>
      <AutoComplete
        open={open}
        onDropdownVisibleChange={setOpen}
        className={commonClassName}
        onSelect={handleSelect}
        filterOption={(inputValue, option) =>
          String(option!.value)
            .toUpperCase()
            .indexOf(inputValue.toUpperCase()) !== -1
        }
        {...props}
      />
    </div>
  );
};

export default KAutoComplete;
