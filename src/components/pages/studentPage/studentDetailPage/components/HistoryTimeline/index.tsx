import { Card } from "antd";
import { Timeline } from "antd";
import React from "react";

interface HistoryTimelineProps {
  timelineItems: any;
}

const HistoryTimeline = ({ timelineItems }: HistoryTimelineProps) => {
  return (
    <Card title="Lịch sử hoạt động" className="shadow-sm">
      <Timeline items={timelineItems} />
    </Card>
  );
};

export default HistoryTimeline;
