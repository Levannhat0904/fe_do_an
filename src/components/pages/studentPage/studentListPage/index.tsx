"use client";
import React, { useState, useCallback } from "react";

import { Table, Tag, Space, Input, Alert, Button, Modal, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { FACULTY_OPTIONS, MAJOR_OPTIONS } from "@/constants/values";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { useGetStudents } from "@/api/student";
import { StudentStatusEnum } from "@/constants/enums";

interface StudentData {
  id: number;
  studentCode: string;
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  faculty: string;
  major: string;
  className: string;
  status: string;
  avatarPath?: string;
}

interface StudentListResponse {
  data: StudentData[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  success: boolean;
}

const getColumnSearchProps = (dataIndex: keyof StudentData) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: any) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Tìm ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => confirm()}
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
        >
          Tìm
        </Button>
        <Button onClick={() => clearFilters()} size="small">
          Đặt lại
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value: any, record: StudentData) =>
    record[dataIndex]
      ?.toString()
      .toLowerCase()
      .includes((value as string).toLowerCase()) || false,
});

const StudentPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useGetStudents(page, limit, searchText);
  const [error, setError] = useState<string | null>(null);
  const [modal, contextHolder] = Modal.useModal();
  const router = useRouter();
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchText(value);
      setPage(1); // Reset to first page when searching
    }, 500),
    []
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleViewDetail = (id: number) => {
    router.push(`/quan-ly-sinh-vien/${id}`);
  };

  const columns: ColumnsType<StudentData> = [
    {
      title: "MSSV",
      dataIndex: "studentCode",
      key: "studentCode",
      fixed: "left",
      width: 100,
      sorter: true,
      ...getColumnSearchProps("studentCode"),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      filters: [
        { text: "Nam", value: "male" },
        { text: "Nữ", value: "female" },
      ],
      onFilter: (value: boolean | React.Key, record) => record.gender === value,
      render: (gender: string) => (
        <Tag color={gender === "male" ? "blue" : "pink"}>
          {gender === "male" ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthDate",
      key: "birthDate",
      width: 120,
      sorter: true,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      sorter: true,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Lớp",
      dataIndex: "className",
      key: "className",
      width: 100,
      sorter: true,
      ...getColumnSearchProps("className"),
    },
    {
      title: "Khoa",
      dataIndex: "faculty",
      key: "faculty",
      width: 150,
      filters: FACULTY_OPTIONS.map((f) => ({ text: f.label, value: f.value })),
      onFilter: (value: boolean | React.Key, record) =>
        record.faculty === value,
    },
    {
      title: "Chuyên ngành",
      dataIndex: "major",
      key: "major",
      width: 150,
      filters: Object.values(MAJOR_OPTIONS)
        .flat()
        .map((m) => ({ text: m.label, value: m.value })),
      onFilter: (value: boolean | React.Key, record) => record.major === value,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: "Chờ duyệt", value: "pending" },
        { text: "Đã duyệt", value: "active" },
        { text: "Đã từ chối", value: "inactive" },
        { text: "Đã khóa", value: "blocked" },
      ],
      onFilter: (value: boolean | React.Key, record) => record.status === value,
      render: (status: string) => {
        switch (status) {
          case "active":
            return <Tag color="green">Đã duyệt</Tag>;
          case "pending":
            return <Tag color="orange">Chờ duyệt</Tag>;
          case "inactive":
            return <Tag color="red">Đã từ chối</Tag>;
          case "blocked":
            return <Tag color="black">Đã khóa</Tag>;
          default:
            return <Tag color="default">{status}</Tag>;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Quản lý sinh viên</h1>
        <Input.Search
          placeholder="Tìm kiếm..."
          allowClear
          style={{ width: 300 }}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Table
        columns={columns}
        dataSource={data?.data}
        loading={isLoading}
        rowKey="id"
        scroll={{ x: 1500 }}
        pagination={{
          current: data?.pagination?.currentPage,
          pageSize: data?.pagination?.itemsPerPage,
          total: data?.pagination?.totalItems,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        onChange={(pagination, filters, sorter) => {
          setPage(pagination.current || 1);
          setLimit(pagination.pageSize || 10);

          // Handle sorting
          if (sorter && "field" in sorter) {
            console.log("Sort by:", sorter.field, sorter.order);
          }

          // Handle filters
          if (filters) {
            console.log("Filters:", filters);
          }
        }}
      />
      {contextHolder}
    </div>
  );
};

export default StudentPage;
