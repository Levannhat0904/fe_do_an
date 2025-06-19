"use client";
import React, { useState, useCallback, useEffect } from "react";

import { Table, Tag, Space, Input, Alert, Button, Modal, Tooltip, Select } from "antd";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useGetStudents } from "@/api/student";
import { StudentStatusEnum } from "@/constants/enums";
import { Student } from "@/types/student";

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

interface FilterParams {
  page: number;
  limit: number;
  searchText: string;
  gender?: string[];
  faculty?: string[];
  major?: string[];
  status?: string[];
  sortField?: string;
  sortOrder?: string;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Đọc các tham số từ URL
  const getInitialParam = (param: string, defaultValue: any) => {
    const value = searchParams.get(param);
    return value ? (param === 'page' || param === 'limit' ? parseInt(value) : value) : defaultValue;
  };
  
  const getInitialArrayParam = (param: string) => {
    const value = searchParams.getAll(param);
    return value.length > 0 ? value : null;
  };
  
  const [page, setPage] = useState(getInitialParam('page', 1));
  const [limit, setLimit] = useState(getInitialParam('limit', 10));
  const [searchText, setSearchText] = useState(getInitialParam('search', ''));
  const [inputValue, setInputValue] = useState(getInitialParam('search', ''));
  const [statusFilter, setStatusFilter] = useState(getInitialParam('status', ''));
  const [filters, setFilters] = useState<Record<string, string[] | null>>({
    gender: getInitialArrayParam('gender'),
    faculty: getInitialArrayParam('faculty'),
    major: getInitialArrayParam('major'),
    status: getInitialArrayParam('status'),
  });
  const [sorter, setSorter] = useState({
    field: getInitialParam('sortField', ''),
    order: getInitialParam('sortOrder', ''),
  });
  
  const { data, isLoading } = useGetStudents(page, limit, searchText, statusFilter);
  const [error, setError] = useState<string | null>(null);
  const [modal, contextHolder] = Modal.useModal();
  
  // Cập nhật URL dựa trên các tham số
  const updateURL = useCallback((params: FilterParams) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('page');
    url.searchParams.delete('limit');
    url.searchParams.delete('search');
    url.searchParams.delete('gender');
    url.searchParams.delete('faculty');
    url.searchParams.delete('major');
    url.searchParams.delete('status');
    url.searchParams.delete('sortField');
    url.searchParams.delete('sortOrder');
    
    if (params.page) url.searchParams.set('page', params.page.toString());
    if (params.limit) url.searchParams.set('limit', params.limit.toString());
    if (params.searchText) url.searchParams.set('search', params.searchText);
    
    if (params.gender?.length) {
      params.gender.forEach(gender => {
        url.searchParams.append('gender', gender);
      });
    }
    
    if (params.faculty?.length) {
      params.faculty.forEach(faculty => {
        url.searchParams.append('faculty', faculty);
      });
    }
    
    if (params.major?.length) {
      params.major.forEach(major => {
        url.searchParams.append('major', major);
      });
    }
    
    if (params.status?.length) {
      params.status.forEach(status => {
        url.searchParams.append('status', status);
      });
    }
    
    if (params.sortField) url.searchParams.set('sortField', params.sortField);
    if (params.sortOrder) url.searchParams.set('sortOrder', params.sortOrder);
    
    window.history.pushState({}, '', url.toString());
  }, []);
  
  // Áp dụng filter và cập nhật URL
  const applyFilters = useCallback((newParams: Partial<FilterParams & { statusFilter?: string }>) => {
    const updatedParams: FilterParams = {
      page: newParams.page !== undefined ? newParams.page : page,
      limit: newParams.limit !== undefined ? newParams.limit : limit,
      searchText: newParams.searchText !== undefined ? newParams.searchText : searchText,
      gender: newParams.gender !== undefined ? newParams.gender : filters.gender || undefined,
      faculty: newParams.faculty !== undefined ? newParams.faculty : filters.faculty || undefined,
      major: newParams.major !== undefined ? newParams.major : filters.major || undefined,
      status: newParams.status !== undefined ? newParams.status : filters.status || undefined,
      sortField: newParams.sortField !== undefined ? newParams.sortField : sorter.field,
      sortOrder: newParams.sortOrder !== undefined ? newParams.sortOrder : sorter.order,
    };
    
    // Mọi thay đổi filter đều reset page về 1, trừ khi đó là thay đổi page
    if (newParams.page === undefined && 
        (newParams.searchText !== undefined || 
         newParams.gender !== undefined || 
         newParams.faculty !== undefined || 
         newParams.major !== undefined || 
         newParams.status !== undefined || 
         newParams.statusFilter !== undefined ||
         newParams.sortField !== undefined || 
         newParams.sortOrder !== undefined)) {
      updatedParams.page = 1;
      setPage(1);
    }
    
    // Cập nhật URL với thêm tham số status từ statusFilter
    const url = new URL(window.location.href);
    url.searchParams.delete('page');
    url.searchParams.delete('limit');
    url.searchParams.delete('search');
    url.searchParams.delete('gender');
    url.searchParams.delete('faculty');
    url.searchParams.delete('major');
    url.searchParams.delete('status');
    url.searchParams.delete('sortField');
    url.searchParams.delete('sortOrder');
    
    if (updatedParams.page) url.searchParams.set('page', updatedParams.page.toString());
    if (updatedParams.limit) url.searchParams.set('limit', updatedParams.limit.toString());
    if (updatedParams.searchText) url.searchParams.set('search', updatedParams.searchText);
    
    // Sử dụng statusFilter cho URL thay vì status array
    if (newParams.statusFilter !== undefined) {
      setStatusFilter(newParams.statusFilter);
      if (newParams.statusFilter) {
        url.searchParams.set('status', newParams.statusFilter);
      }
    } else if (statusFilter) {
      url.searchParams.set('status', statusFilter);
    }
    
    if (updatedParams.gender?.length) {
      updatedParams.gender.forEach(gender => {
        url.searchParams.append('gender', gender);
      });
    }
    
    if (updatedParams.faculty?.length) {
      updatedParams.faculty.forEach(faculty => {
        url.searchParams.append('faculty', faculty);
      });
    }
    
    if (updatedParams.major?.length) {
      updatedParams.major.forEach(major => {
        url.searchParams.append('major', major);
      });
    }
    
    if (updatedParams.sortField) url.searchParams.set('sortField', updatedParams.sortField);
    if (updatedParams.sortOrder) url.searchParams.set('sortOrder', updatedParams.sortOrder);
    
    window.history.pushState({}, '', url.toString());
    
    // Cập nhật state
    if (newParams.limit !== undefined) setLimit(newParams.limit);
    if (newParams.searchText !== undefined) setSearchText(newParams.searchText);
    
    if (newParams.gender !== undefined || 
        newParams.faculty !== undefined || 
        newParams.major !== undefined || 
        newParams.status !== undefined) {
      setFilters(prev => ({
        ...prev,
        ...(newParams.gender !== undefined && { gender: newParams.gender }),
        ...(newParams.faculty !== undefined && { faculty: newParams.faculty }),
        ...(newParams.major !== undefined && { major: newParams.major }),
        ...(newParams.status !== undefined && { status: newParams.status }),
      }));
    }
    
    if (newParams.sortField !== undefined || newParams.sortOrder !== undefined) {
      setSorter({
        field: newParams.sortField !== undefined ? newParams.sortField : sorter.field,
        order: newParams.sortOrder !== undefined ? newParams.sortOrder : sorter.order,
      });
    }
  }, [page, limit, searchText, statusFilter, filters, sorter]);

  // Khởi tạo URL từ searchParams khi component mount
  useEffect(() => {
    applyFilters({});
  }, []);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      applyFilters({ searchText: value });
    }, 500),
    [applyFilters]
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleSearchButtonClick = (value: string) => {
    applyFilters({ searchText: value });
  };

  const handleViewDetail = (id: number) => {
    router.push(`/quan-ly-sinh-vien/${id}`);
  };

  const STATUS_OPTIONS = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ duyệt" },
    { value: "active", label: "Đã duyệt" },
    { value: "inactive", label: "Đã từ chối" },
  ];

  const handleStatusChange = (value: string) => {
    applyFilters({ status: value ? [value] : undefined, statusFilter: value });
  };

  const columns: ColumnsType<StudentData> = [
    {
      title: "MSSV",
      dataIndex: "studentCode",
      key: "studentCode",
      fixed: "left",
      width: 100,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
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
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Lớp",
      dataIndex: "className",
      key: "className",
      width: 100,
    },
    {
      title: "Khoa",
      dataIndex: "faculty",
      key: "faculty",
      width: 150,
    },
    {
      title: "Chuyên ngành",
      dataIndex: "major",
      key: "major",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
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
    <div className="p-2 sm:p-4 md:p-6">
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-lg md:text-2xl font-semibold text-center md:text-left">Quản lý sinh viên</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto justify-center md:justify-end">
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 180 }}
            onChange={handleStatusChange}
            value={statusFilter}
            options={STATUS_OPTIONS}
            className="w-full sm:w-[180px]"
          />
          <Input.Search
            placeholder="Tìm kiếm..."
            allowClear
            className="w-full sm:w-[300px]"
            value={inputValue}
            onSearch={handleSearchButtonClick}
            onChange={handleSearchInputChange}
          />
        </div>
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

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <Table
          columns={columns as ColumnsType<Student>}
          dataSource={data?.data}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.pagination?.totalItems,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              applyFilters({ page, limit: pageSize });
            },
            position: ["bottomLeft"],
          }}
          onChange={(pagination, tableFilters, tableSorter) => {
            // Xử lý filters
            const newFilters: Record<string, string[] | undefined> = {};
            Object.entries(tableFilters).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                newFilters[key] = value as string[];
              }
            });
            // Xử lý sorter
            let newSortField = '';
            let newSortOrder = '';
            if (tableSorter && 'field' in tableSorter && 'order' in tableSorter) {
              newSortField = tableSorter.field?.toString() || '';
              newSortOrder = tableSorter.order?.toString() || '';
            }
            applyFilters({
              ...newFilters,
              sortField: newSortField,
              sortOrder: newSortOrder,
            });
          }}
          className="min-w-[600px]"
        />
      </div>
      {contextHolder}
    </div>
  );
};

export default StudentPage;
