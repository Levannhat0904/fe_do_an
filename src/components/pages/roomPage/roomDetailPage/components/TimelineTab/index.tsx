import React from "react";
import { Card, Timeline, Tag, Avatar, Empty, Spin } from "antd";
import dayjs from "dayjs";

interface TimelineItem {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  userName: string;
  userType: string;
  userAvatar?: string;
}

interface TimelineTabProps {
  timelineData: TimelineItem[];
  isLoading: boolean;
}

const TimelineTab: React.FC<TimelineTabProps> = ({ timelineData, isLoading }) => {
  // Get color for timeline item based on action type
  const getTimelineItemColor = (action: string): string => {
    const colorMap: Record<string, string> = {
      create: "green",
      update: "blue",
      delete: "red",
      status_change: "orange",
      remove: "red",
    };
    return colorMap[action] || "blue";
  };

  // Format timestamp for timeline
  const formatTimestamp = (timestamp: string): string => {
    return dayjs(timestamp).format("DD/MM/YYYY HH:mm:ss");
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin />
        <div style={{ marginTop: "8px" }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <Card title="Lịch sử hoạt động của phòng" bordered={false}>
      {timelineData.length > 0 ? (
        <Timeline mode="left">
          {timelineData.map((item) => (
            <Timeline.Item
              key={item.id}
              color={getTimelineItemColor(item.action)}
              label={formatTimestamp(item.timestamp)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  {item.userAvatar ? (
                    <Avatar
                      src={item.userAvatar}
                      size={40}
                      style={{ marginRight: 8 }}
                    />
                  ) : (
                    <Avatar size={40} style={{ marginRight: 8 }}>
                      {item.userName
                        ? item.userName.charAt(0).toUpperCase()
                        : "U"}
                    </Avatar>
                  )}
                </div>
                <div>
                  <div>
                    <strong>{item.userName}</strong>
                    <Tag
                      color={item.userType === "admin" ? "red" : "blue"}
                      style={{ marginLeft: 8 }}
                    >
                      {item.userType === "admin"
                        ? "Quản trị viên"
                        : "Sinh viên"}
                    </Tag>
                  </div>
                  <div>{item.description}</div>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Empty description="Không có dữ liệu lịch sử hoạt động nào" />
      )}
    </Card>
  );
};

export default TimelineTab; 