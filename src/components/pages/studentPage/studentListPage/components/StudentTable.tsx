"use client";

import React, { useState, useMemo } from "react";
import DataTable from "@/components/organisms/DataTable";
import { TPaginationResponse } from "@/constants";
import { getColumns } from "./colum";
import { usePathname, useRouter } from "next/navigation";
import DrawerEditStudent from "@/components/organisms/DrawerEditStudent";

interface StudentTableProps {
  data: any[];
  pagination?: TPaginationResponse;
  onPaginationChange?: (page: number, pageSize: number) => void;
  loading?: boolean;
}

const StudentTable: React.FC<StudentTableProps> = ({
  data,
  loading,
  pagination,
  onPaginationChange,
}) => {
  const [openDrawerEditStudent, setOpenDrawerEditStudent] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const router = useRouter();
  const pathName = usePathname();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedRowKeys(
      checked && data ? data.map((item) => Number(item.id)) : []
    );
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    setSelectedRowKeys((prevSelected) =>
      checked ? [...prevSelected, id] : prevSelected.filter((key) => key !== id)
    );
  };
  const handleEdit = (id: number) => {
    console.log(id);
  };
  const columns = useMemo(
    () =>
      getColumns({
        selectedRowKeys,
        selectAll,
        handleSelectAll,
        handleSelectRow,
        handleEdit,
        setOpenDrawerEditStudent,
        setStudent,
      }),
    [selectedRowKeys, selectAll]
  );

  const handlePaginationChange = (page: number, pageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange(page, pageSize);
    }
  };

  return (
    <>
      <DataTable
        loading={loading}
        columns={columns as []}
        dataSource={data}
        pagination={pagination}
        onRow={(record) => ({
          onClick: () => {
            setStudent(record);
            setOpenDrawerEditStudent(true);
            router.push(`${pathName}/${record.id}`);
          },
          className: "cursor-pointer",
        })}
      />
      <DrawerEditStudent
        open={openDrawerEditStudent}
        onClose={() => setOpenDrawerEditStudent(false)}
        student={student}
      />
    </>
  );
};

export default StudentTable;
