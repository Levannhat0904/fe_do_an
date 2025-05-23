import React from 'react';
import { Space, Tooltip, Badge } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DataTable } from '../../molecules';
import { ActionButton, FormattedDate, StatusTag } from '../../atoms';

interface ResidentsTableProps {
  residents: any[];
  onAdd: () => void;
  onEdit: (resident: any) => void;
  onRemove: (resident: any) => void;
  loading?: boolean;
}

const ResidentsTable: React.FC<ResidentsTableProps> = ({
  residents,
  onAdd,
  onEdit,
  onRemove,
  loading = false,
}) => {
  const columns = [
    {
      title: "Mã SV",
      dataIndex: "studentCode",
      key: "studentCode",
      width: 120,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender: string) => (
        <StatusTag status={gender === "male" ? "male" : "female"} />
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 130,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: {
        showTitle: false,
      },
      render: (email: string) => (
        <Tooltip placement="topLeft" title={email}>
          {email}
        </Tooltip>
      ),
    },
    {
      title: "Ngày vào",
      dataIndex: "joinDate",
      key: "joinDate",
      width: 120,
      render: (date: string) => (
        <FormattedDate date={date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        return <StatusTag status={status} />;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <ActionButton
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa khỏi phòng">
            <ActionButton
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onRemove(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      dataSource={residents}
      loading={loading}
      showAddButton={true}
      addButtonText="Thêm sinh viên"
      onAdd={onAdd}
      emptyText="Chưa có sinh viên nào trong phòng"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} của ${total} sinh viên`,
      }}
    />
  );
};

export default ResidentsTable; 