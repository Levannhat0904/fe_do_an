import React from "react";
import { List, Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Roommate } from "@/types/student";

interface RoommateListProps {
  roommates: Roommate[];
}

/**
 * Component hiển thị danh sách bạn cùng phòng
 * Hiển thị thông tin như: ảnh đại diện, tên, mã số sinh viên
 */
const RoommateList: React.FC<RoommateListProps> = ({ roommates }) => {
  return (
    <List
      itemLayout="horizontal"
      locale={{ emptyText: "Không có bạn cùng phòng" }}
      dataSource={roommates}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Badge
                status={item.status === "active" ? "success" : "default"}
                offset={[-5, 32]}
              >
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  src={item.avatarPath}
                  style={{ backgroundColor: "#fa8c16" }}
                />
              </Badge>
            }
            title={item.fullName}
            description={`MSSV: ${item.studentCode}`}
          />
        </List.Item>
      )}
    />
  );
};

export default RoommateList;
