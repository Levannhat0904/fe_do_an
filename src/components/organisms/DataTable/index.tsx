"use client";

import React from "react";
import { Table, TableProps, TablePaginationConfig } from "antd";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  colors,
  ICON_SIZE_DEFAULT,
  PAGE_SIZE_OPTIONS,
  NavigationButtonType,
  TPaginationResponse,
} from "@/constants";
import styles from "./styles.module.scss";
import { usePagination } from "@/hooks/common/usePagination";

interface DataTableProps<T> extends Omit<TableProps<T>, "pagination"> {
  pagination?: TPaginationResponse;
}

const DataTable = <T extends { id: string | number }>({
  pagination,
  ...props
}: DataTableProps<T>) => {
  const { total } = pagination || {};
  const { limit, page, handlePageChange } = usePagination();

  const getPaginationConfig = (): TablePaginationConfig => ({
    total,
    pageSize: limit,
    current: page,
    onChange: handlePageChange,
    showSizeChanger: true,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    itemRender: (_, type, originalElement) => {
      if (type === NavigationButtonType.Prev) {
        return (
          <CaretLeft
            size={ICON_SIZE_DEFAULT}
            color={colors.characterSecondary45}
          />
        );
      }
      if (type === NavigationButtonType.Next) {
        return (
          <CaretRight
            size={ICON_SIZE_DEFAULT}
            color={colors.characterSecondary45}
          />
        );
      }
      return originalElement;
    },
  });

  return (
    <Table
      {...props}
      scroll={{ x: "max-content" }}
      className={styles.container}
      rowKey="id"
      pagination={getPaginationConfig()}
      rowClassName="bg-white whitespace-nowrap w-[150px]"
    />
  );
};

export default DataTable;
