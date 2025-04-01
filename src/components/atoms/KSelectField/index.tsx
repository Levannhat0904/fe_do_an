"use client";

import { FormInstance, Select, SelectProps } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/utils";
import {
  colors,
  ICON_SIZE_SMALL,
  IconWeightType,
  SEARCH_DEBOUNCE_TIME,
} from "@/constants";
import { debounce } from "lodash";

type Props = SelectProps & {
  form?: FormInstance;
  name?: string;
  customOnChange?: (value: any, form?: FormInstance) => void;
  fetchOptions?: (search: string) => Promise<any[] | void>;
  onLoadMore?: () => void;
  loading?: boolean;
};

function KSelectField({ fetchOptions = undefined, ...props }: Props) {
  const [open, setOpen] = useState(false);

  const commonClassName = cn(
    styles.customSelector,
    "!rounded-lg !border-neutral4 !h-12"
  );

  const debounceFetcher = useCallback(
    debounce((search: string) => {
      if (fetchOptions) {
        fetchOptions(search);
      }
    }, SEARCH_DEBOUNCE_TIME),
    [fetchOptions]
  );

  const handleSelect = useCallback(
    (value: any, option: any) => {
      const selectedValue = {
        value: value,
        label: option.label,
      };

      props?.onSelect?.(value, option);
      props?.customOnChange?.(selectedValue, props?.form);
    },
    [props]
  );

  const handlePopupScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const scrollTop = Math.ceil(target.scrollTop);
      const visibleHeight = target.offsetHeight;
      const totalHeight = target.scrollHeight;

      const isBottom = totalHeight - (scrollTop + visibleHeight) <= 1;

      if (!props.loading && isBottom) {
        props.onLoadMore?.();
      }
    },
    [props.loading, props.onLoadMore]
  );

  return (
    <Select
      open={open}
      onDropdownVisibleChange={setOpen}
      className={commonClassName}
      onSelect={handleSelect}
      onSearch={fetchOptions ? debounceFetcher : undefined}
      filterOption={fetchOptions ? false : true}
      onPopupScroll={handlePopupScroll}
      virtual={false}
      showSearch={!!fetchOptions}
      optionRender={(option) => {
        return (
          <div className="!w-full h-auto text-wrap text-justify">
            {option.label}
          </div>
        );
      }}
      suffixIcon={
        props?.suffixIcon ?? (
          <div
            className="rounded-full border border-sdark3 p-1 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <CaretDown
              size={ICON_SIZE_SMALL}
              weight={IconWeightType.bold}
              color={colors.sdark3}
            />
          </div>
        )
      }
      {...props}
    />
  );
}

export default KSelectField;
