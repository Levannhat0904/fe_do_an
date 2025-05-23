import React from 'react';
import { Card, Descriptions } from 'antd';

interface InfoItem {
  label: string;
  value: React.ReactNode;
  span?: number;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
  column?: { xs?: number; sm?: number; md?: number; lg?: number };
  bordered?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  items,
  column = { xs: 1, sm: 1, md: 2 },
  bordered = false,
}) => {
  return (
    <Card title={title} bordered={bordered}>
      <Descriptions bordered column={column}>
        {items.map((item, index) => (
          <Descriptions.Item 
            key={index} 
            label={item.label}
            span={item.span}
          >
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
};

export default InfoCard; 