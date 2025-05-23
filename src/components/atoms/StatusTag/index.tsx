import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
  status: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "available":
        return { color: "green", text: "Còn trống" };
      case "full":
        return { color: "blue", text: "Đã đầy" };
      case "maintenance":
        return { color: "pink", text: "Đang bảo trì" };
      case "pending":
        return { color: "orange", text: "Chờ xử lý" };
      case "processing":
        return { color: "blue", text: "Đang xử lý" };
      case "completed":
        return { color: "green", text: "Hoàn thành" };
      case "paid":
        return { color: "green", text: "Đã thanh toán" };
      case "unpaid":
        return { color: "red", text: "Chưa thanh toán" };
      case "partial":
        return { color: "orange", text: "Thanh toán một phần" };
      case "overdue":
        return { color: "red", text: "Quá hạn" };
      case "active":
        return { color: "green", text: "Đang hoạt động" };
      case "inactive":
        return { color: "default", text: "Không hoạt động" };
      case "suspended":
        return { color: "red", text: "Tạm ngưng" };
      case "male":
        return { color: "blue", text: "Nam" };
      case "female":
        return { color: "pink", text: "Nữ" };
      case "approved":
        return { color: "green", text: "Đã duyệt" };
      case "rejected":
        return { color: "red", text: "Từ chối" };
      case "waiting_for_approval":
        return { color: "orange", text: "Chờ duyệt" };
      default:
        return { color: "default", text: status };
    }
  };

  const { color, text } = getStatusConfig(status);
  return <Tag color={color}>{text}</Tag>;
};

export default StatusTag; 