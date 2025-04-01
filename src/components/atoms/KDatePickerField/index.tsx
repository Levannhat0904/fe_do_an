"use client";

import { cn } from "@/utils";
import { DatePicker, DatePickerProps } from "antd";
import React from "react";
import { colors, IconWeightType } from "@/constants";
import { Calendar } from "@phosphor-icons/react";

type Props = DatePickerProps;

function KDatePickerField(props: Props) {
  const commonClassName = cn("!rounded-lg !h-12 w-full", props?.className);

  return (
    <DatePicker
      className={commonClassName}
      suffixIcon={
        <div className="rounded-full border border-sdark3 p-1 cursor-pointer">
          <Calendar
            size={16}
            weight={IconWeightType.bold}
            color={colors.sdark3}
          />
        </div>
      }
      {...props}
    />
  );
}

export default KDatePickerField;
