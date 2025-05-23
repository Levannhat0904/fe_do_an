import React from 'react';
import { Tabs } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  ToolOutlined,
  CreditCardOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { RoomDetail } from '@/api/room';
import RoomInfoCard from '../RoomInfoCard';
import ResidentsTable from '../ResidentsTable';
import {
  MaintenanceTab,
  TimelineTab,
  UtilitiesTab,
} from '../../pages/roomPage/roomDetailPage/components';

interface RoomDetailTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  data: RoomDetail;
  residents: any[];
  maintenanceHistory: any[];
  pendingRequests: any[];
  utilities: any[];
  timelineData: any[];
  isTimelineLoading: boolean;
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

const RoomDetailTabs: React.FC<RoomDetailTabsProps> = ({
  activeTab,
  onTabChange,
  data,
  residents,
  maintenanceHistory,
  pendingRequests,
  utilities,
  timelineData,
  isTimelineLoading,
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
  return (
    <Tabs
      activeKey={activeTab}
      onChange={onTabChange}
      items={[
        {
          key: "info",
          label: (
            <span>
              <HomeOutlined /> Thông tin phòng
            </span>
          ),
          children: (
            <RoomInfoCard
              room={data.room}
              residents={residents}
            />
          ),
        },
        {
          key: "residents",
          label: (
            <span>
              <UserOutlined /> Sinh viên ({residents ? residents.length : 0})
            </span>
          ),
          children: (
            <ResidentsTable
              residents={residents}
              onAdd={onAddResident}
              onEdit={onEditResident}
              onRemove={onRemoveResident}
            />
          ),
        },
        {
          key: "maintenance",
          label: (
            <span>
              <ToolOutlined /> Bảo trì & Yêu cầu
            </span>
          ),
          children: (
            <MaintenanceTab
              maintenanceHistory={maintenanceHistory}
              pendingRequests={pendingRequests}
              onAddMaintenance={onAddMaintenance}
              onProcessRequest={onProcessRequest}
              onViewMaintenance={onViewMaintenance}
            />
          ),
        },
        {
          key: "utilities",
          label: (
            <span>
              <CreditCardOutlined /> Hóa đơn tiện ích
            </span>
          ),
          children: (
            <UtilitiesTab
              utilities={utilities}
              onAddUtility={onAddUtility}
              onEditInvoice={onEditInvoice}
              onUpdatePaymentStatus={onUpdatePaymentStatus}
              onPrintInvoice={onPrintInvoice}
            />
          ),
        },
        {
          key: "timeline",
          label: (
            <span>
              <HistoryOutlined /> Lịch sử hoạt động
            </span>
          ),
          children: (
            <TimelineTab
              timelineData={timelineData}
              isLoading={isTimelineLoading}
            />
          ),
        },
      ]}
    />
  );
};

export default RoomDetailTabs; 