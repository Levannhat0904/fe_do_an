import React from 'react';
import { Spin } from 'antd';

interface LoadingSpinnerProps {
  tip?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ tip = "Đang tải dữ liệu..." }) => {
  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <Spin size="large" />
      <div style={{ marginTop: "8px" }}>{tip}</div>
    </div>
  );
};

export default LoadingSpinner; 