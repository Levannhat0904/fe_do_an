import React from "react";
import { Table, Button, Space, Tooltip, Badge, Empty } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { formatDate } from "../../utils";

interface ResidentsTabProps {
  residents: any[];
  onAddResident: () => void;
  onEditResident: (resident: any) => void;
  onRemoveResident: (resident: any) => void;
}

const ResidentsTab: React.FC<ResidentsTabProps> = ({
  residents,
  onAddResident,
  onEditResident,
  onRemoveResident,
}) => {
  const columns = [
    {
      title: "Mã SV",
      dataIndex: "studentCode",
      key: "studentCode",
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
      render: (gender: string) => (gender === "male" ? "Nam" : "Nữ"),
    },
    {
      title: "Ngày vào",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Ngày ra dự kiến",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => {
        if (status === "paid") {
          return <Badge status="success" text="Đã thanh toán" />;
        } else if (status === "partial") {
          return <Badge status="warning" text="Thanh toán một phần" />;
        } else {
          return <Badge status="error" text="Chưa thanh toán" />;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: any) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEditResident(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onRemoveResident(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h3>Danh sách sinh viên</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddResident}
        >
          Thêm sinh viên
        </Button>
      </div>
      {residents && residents.length > 0 ? (
        <Table
          columns={columns}
          dataSource={residents}
          rowKey="id"
          pagination={false}
        />
      ) : (
        <Empty description="Không có sinh viên trong phòng này" />
      )}
    </>
  );
};

export default ResidentsTab; 