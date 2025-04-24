import { Card } from "antd";
import { Timeline } from "antd";
import React from "react";
import dayjs from "dayjs";

interface HistoryItem {
  id: number;
  date: string;
  action: string;
  description: string;
  user: string;
}

interface HistoryTimelineProps {
  timelineItems: {
    children: React.ReactNode;
    color: string;
  }[];
}

const HistoryTimeline = ({ timelineItems }: HistoryTimelineProps) => {
  if (!timelineItems || timelineItems.length === 0) {
    return (
      <Card title="Lịch sử hoạt động" className="shadow-sm">
        <div className="text-center text-gray-500 py-4">
          Không có lịch sử hoạt động
        </div>
      </Card>
    );
  }

  return (
    <Card title="Lịch sử hoạt động" className="shadow-sm">
      <Timeline items={timelineItems} />
    </Card>
  );
};

export default HistoryTimeline;
