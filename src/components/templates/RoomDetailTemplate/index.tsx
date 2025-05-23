import React from 'react';
import { RoomDetail } from '@/api/room';
import LoadingSpinner from '../../atoms/LoadingSpinner';
import ErrorResult from '../../molecules/ErrorResult';
import RoomDetailHeader from '../../organisms/RoomDetailHeader';
import RoomDetailTabs from '../../organisms/RoomDetailTabs';

interface RoomDetailTemplateProps {
  isLoading: boolean;
  error: any;
  data: RoomDetail | null;
  activeTab: string;
  timelineData: any[];
  isTimelineLoading: boolean;
  onBack: () => void;
  onTabChange: (key: string) => void;
  onEdit: () => void;
  onToggleStatus: (status: string) => void;
  onAddResident: () => void;
  onEditResident: () => void;
  onRemoveResident: (resident: any) => void;
  onAddMaintenance: () => void;
  onProcessRequest: (request: any) => void;
  onViewMaintenance: (id: number) => void;
  onAddUtility: () => void;
  onEditInvoice: (invoice: any) => void;
  onUpdatePaymentStatus: (invoiceId: number) => void;
  onPrintInvoice: (invoice: any) => void;
}

const RoomDetailTemplate: React.FC<RoomDetailTemplateProps> = ({
  isLoading,
  error,
  data,
  activeTab,
  timelineData,
  isTimelineLoading,
  onBack,
  onTabChange,
  onEdit,
  onToggleStatus,
  onAddResident,
  onEditResident,
  onRemoveResident,
  onAddMaintenance,
  onProcessRequest,
  onViewMaintenance,
  onAddUtility,
  onEditInvoice,
  onUpdatePaymentStatus,
  onPrintInvoice,
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorResult
        status="error"
        title="Lỗi tải dữ liệu"
        subTitle="Không thể tải thông tin phòng. Vui lòng thử lại sau."
        onBack={onBack}
        backText="Quay lại danh sách phòng"
      />
    );
  }

  if (!data || !data.room) {
    return (
      <ErrorResult
        status="warning"
        title="Không tìm thấy dữ liệu"
        subTitle="Không có thông tin phòng hoặc dữ liệu không đầy đủ."
        onBack={onBack}
        backText="Quay lại danh sách phòng"
      />
    );
  }

  const {
    room,
    residents = [],
    maintenanceHistory = [],
    pendingRequests = [],
    utilities = [],
  } = data;

  return (
    <div style={{ padding: "16px" }}>
      <RoomDetailHeader
        roomNumber={room.roomNumber}
        status={room.status}
        onBack={onBack}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
      />
      <RoomDetailTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        data={data}
        residents={residents}
        maintenanceHistory={maintenanceHistory}
        pendingRequests={pendingRequests}
        utilities={utilities}
        timelineData={timelineData}
        isTimelineLoading={isTimelineLoading}
        onAddResident={onAddResident}
        onEditResident={onEditResident}
        onRemoveResident={onRemoveResident}
        onAddMaintenance={onAddMaintenance}
        onProcessRequest={onProcessRequest}
        onViewMaintenance={onViewMaintenance}
        onAddUtility={onAddUtility}
        onEditInvoice={onEditInvoice}
        onUpdatePaymentStatus={onUpdatePaymentStatus}
        onPrintInvoice={onPrintInvoice}
      />
    </div>
  );
};

export default RoomDetailTemplate; 