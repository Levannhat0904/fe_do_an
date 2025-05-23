import React from 'react';
import { Space } from 'antd';
import { RollbackOutlined, EditOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { StatusTag, ActionButton } from '../../atoms';

interface PageHeaderProps {
  title: string;
  status: string;
  onBack: () => void;
  onEdit: () => void;
  onToggleStatus: (status: string) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  status,
  onBack,
  onEdit,
  onToggleStatus,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <Space wrap>
        <ActionButton icon={<RollbackOutlined />} onClick={onBack}>
          Quay lại
        </ActionButton>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <StatusTag status={status} />
      </Space>
      <Space wrap>
        <ActionButton icon={<EditOutlined />} type="primary" onClick={onEdit}>
          Chỉnh sửa thông tin
        </ActionButton>
        {status === "maintenance" ? (
          <ActionButton
            icon={<CheckCircleOutlined />}
            type="primary"
            onClick={() => onToggleStatus("available")}
          >
            Kích hoạt lại
          </ActionButton>
        ) : (
          <ActionButton
            icon={<StopOutlined />}
            danger
            onClick={() => onToggleStatus("maintenance")}
          >
            Đánh dấu bảo trì
          </ActionButton>
        )}
      </Space>
    </div>
  );
};

export default PageHeader; 