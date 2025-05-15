import React from "react";
import { Card, List, Button, Tag, Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { Contract } from "@/types/student";

const { Text } = Typography;

interface ContractCardProps {
  contracts: Contract[];
  onViewContractDetail?: (contractId: number) => void;
}

/**
 * Component hiển thị thông tin hợp đồng của sinh viên
 * Hiển thị danh sách các hợp đồng với các thông tin như: số hợp đồng, thời hạn, trạng thái
 */
const ContractCard: React.FC<ContractCardProps> = ({
  contracts,
  onViewContractDetail,
}) => {
  // Hàm lấy màu cho tag trạng thái
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "success",
      expired: "error",
      terminated: "error",
      pending: "warning",
    };
    return statusColors[status] || "default";
  };

  return (
    <Card
      title={
        <>
          <FileTextOutlined /> Hợp đồng
        </>
      }
      style={{
        marginBottom: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {contracts && contracts.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={contracts}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="detail"
                  type="link"
                  style={{ color: "#fa8c16" }}
                  onClick={() =>
                    onViewContractDetail &&
                    item.id &&
                    onViewContractDetail(item.id)
                  }
                >
                  Chi tiết
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`Hợp đồng #${item.contractNumber}`}
                description={
                  <>
                    <div>
                      Thời hạn:{" "}
                      {item.startDate
                        ? new Date(item.startDate).toLocaleDateString("vi-VN")
                        : ""}{" "}
                      -{" "}
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString("vi-VN")
                        : ""}
                    </div>
                    <div style={{ marginTop: "5px" }}>
                      <Tag color={getStatusColor(item.status || "")}>
                        {item.status === "active"
                          ? "Đang hiệu lực"
                          : item.status === "expired"
                          ? "Đã hết hạn"
                          : "Đã chấm dứt"}
                      </Tag>
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">Chưa có hợp đồng</Text>
        </div>
      )}
    </Card>
  );
};

export default ContractCard;
