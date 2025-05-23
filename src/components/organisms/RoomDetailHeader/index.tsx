import React from 'react';
import { Card } from 'antd';
import PageHeader from '../../molecules/PageHeader';

interface RoomDetailHeaderProps {
  roomNumber: string;
  status: string;
  onBack: () => void;
  onEdit: () => void;
  onToggleStatus: (status: string) => void;
}

const RoomDetailHeader: React.FC<RoomDetailHeaderProps> = ({
  roomNumber,
  status,
  onBack,
  onEdit,
  onToggleStatus,
}) => {
  return (
    <Card>
      <PageHeader
        title={`Chi tiết phòng ${roomNumber}`}
        status={status}
        onBack={onBack}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
      />
    </Card>
  );
};

export default RoomDetailHeader; 