import React from "react";
import { Button, Checkbox } from "antd";
import { StatusEnum } from "@/constants";
interface ColumnProps {
  selectedRowKeys: React.Key[];
  selectAll: boolean;
  handleSelectAll: (checked: boolean) => void;
  handleSelectRow: (id: number, checked: boolean) => void;
  handleEdit: (id: number) => void;
  setOpenDrawerEditStudent: (open: boolean) => void;
  setStudent: (student: any) => void;
}

export const getColumns = ({
  selectedRowKeys,
  selectAll,
  handleSelectAll,
  handleSelectRow,
  handleEdit,
  setOpenDrawerEditStudent,
  setStudent,
}: ColumnProps) => [
  {
    title: (
      <Checkbox
        checked={selectAll}
        onChange={(e) => handleSelectAll(e.target.checked)}
        className="custom-checkbox"
      />
    ),
    dataIndex: "checkbox",
    key: "checkbox",
    render: (_: any, record: { id: string }) => (
      <Checkbox
        checked={selectedRowKeys.includes(Number(record?.id))}
        onChange={(e) => handleSelectRow(Number(record?.id), e.target.checked)}
        className="custom-checkbox"
      />
    ),
    align: "center" as const,
    width: 50,
  },
  {
    title: "Mã sinh viên",
    dataIndex: "student_code",
    key: "student_code",
    width: 120,
    fixed: "left",
  },
  {
    title: "Họ và tên",
    dataIndex: "full_name",
    key: "full_name",
    width: 200,
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    key: "gender",
    width: 100,
    render: (gender: string) => (gender === "male" ? "Nam" : "Nữ"),
  },
  {
    title: "Ngày sinh",
    dataIndex: "birth_date",
    key: "birth_date",
    width: 120,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    width: 120,
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
    width: 200,
  },
  {
    title: "Tỉnh/Thành",
    dataIndex: "province",
    key: "province",
    width: 150,
  },
  {
    title: "Quận/Huyện",
    dataIndex: "district",
    key: "district",
    width: 150,
  },
  {
    title: "Phường/Xã",
    dataIndex: "ward",
    key: "ward",
    width: 150,
  },
  {
    title: "Khoa",
    dataIndex: "department",
    key: "department",
    width: 150,
  },
  {
    title: "Ngành",
    dataIndex: "major",
    key: "major",
    width: 150,
  },
  {
    title: "Lớp",
    dataIndex: "class_name",
    key: "class_name",
    width: 120,
  },
  {
    title: "Niên khóa",
    dataIndex: "school_year",
    key: "school_year",
    width: 100,
  },
  {
    title: "CCCD",
    dataIndex: "citizen_id",
    key: "citizen_id",
    width: 150,
  },
  {
    title: "Người liên hệ khẩn cấp",
    dataIndex: "emergency_contact_name",
    key: "emergency_contact_name",
    width: 200,
  },
  {
    title: "SĐT liên hệ khẩn cấp",
    dataIndex: "emergency_contact_phone",
    key: "emergency_contact_phone",
    width: 150,
  },
  {
    title: "Quan hệ",
    dataIndex: "emergency_contact_relationship",
    key: "emergency_contact_relationship",
    width: 120,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status: string) => (status === "active" ? "Đang học" : "Đã nghỉ"),
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "action",
    width: 100,
    fixed: "right",
    render: (text: string, record: { id: number }) => (
      <Button
        type="link"
        onClick={(e) => {
          e.stopPropagation();
          setStudent(record);
          setOpenDrawerEditStudent(true);
          // router.push(`${pathName}/${record.id}`);
          // handleEdit(record.id);
        }}
      >
        Sửa
      </Button>
    ),
  },
];
