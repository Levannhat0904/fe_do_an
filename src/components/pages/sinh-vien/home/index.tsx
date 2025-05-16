"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Tabs,
  Spin,
  message,
  Modal,
  Form,
  Button,
} from "antd";
import {
  UserOutlined,
  HomeOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  ToolOutlined,
  EditOutlined,
} from "@ant-design/icons";
import studentApi, { useGetCurrentStudentDetail } from "@/api/student";
import contractApi from "@/api/contract";
import { useGetCurrentStudentInvoices } from "@/api/invoice";
import { useGetRoomMaintenanceRequests } from "@/api/student";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import StudentCard from "@/components/molecules/student/StudentCard";
import RoomCard from "@/components/molecules/student/RoomCard";
import ContractCard from "@/components/molecules/student/ContractCard";
import InvoiceTable from "@/components/organisms/student/InvoiceTable";
import MaintenanceRequestTable from "@/components/organisms/student/MaintenanceRequestTable";
import MaintenanceRequestForm from "@/components/organisms/student/MaintenanceRequestForm";
import RoommateList from "@/components/organisms/student/RoommateList";
import {
  RoomCard as HomeRoomCard,
  ContractCard as HomeContractCard,
  InvoiceCard,
  MaintenanceCard,
} from "../HomeCard";
import StudentProfileDrawer from "@/components/organisms/student/StudentProfileDrawer";

import {
  Student,
  Contract,
  Dormitory,
  Invoice,
  MaintenanceRequest,
  Roommate,
} from "@/types/student";
import useFetchProfile from "@/hooks/profile/useFetchProfile";

const { Content } = Layout;
const { TabPane } = Tabs;

const StudentHomePage = () => {
  const { adminProfile: user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [roomData, setRoomData] = useState<Dormitory | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<
    MaintenanceRequest[]
  >([]);
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] =
    useState(false);
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false);

  // Use React Query hooks for getting data
  const {
    data: studentDetail,
    isLoading: isStudentLoading,
    isError: isStudentError,
    error: studentError,
    refetch: refetchStudent,
  } = useGetCurrentStudentDetail();
  const { refetch: refetchProfile } = useFetchProfile();
  // Get invoices using React Query
  const {
    data: invoiceData,
    isLoading: isInvoiceLoading,
    refetch: refetchInvoices,
  } = useGetCurrentStudentInvoices();

  // Get maintenance requests using React Query
  const {
    data: maintenanceData,
    isLoading: isMaintenanceLoading,
    refetch: refetchMaintenance,
  } = useGetRoomMaintenanceRequests(roomData?.roomId || 0);

  useEffect(() => {
    // When student data is loaded from the hook, update our state
    if (studentDetail?.success && studentDetail?.data) {
      setStudentData(studentDetail.data.student || null);
      setRoomData(studentDetail.data.dormitory || null);
      setRoommates(studentDetail.data.roommates || []);

      // Fetch contracts if we have a student ID
      if (studentDetail.data.student?.id) {
        loadContracts(studentDetail.data.student.id);
      }
    } else if (isStudentError) {
      console.error("Error loading student data:", studentError);
      message.error("Không thể tải dữ liệu sinh viên. Vui lòng thử lại sau.");
    }
  }, [studentDetail, isStudentError]);

  // Update invoices when data is loaded
  useEffect(() => {
    if (invoiceData?.success && invoiceData?.data?.invoices) {
      setInvoices(invoiceData.data.invoices);
    }
  }, [invoiceData]);

  // Update maintenance requests when data is loaded
  useEffect(() => {
    if (maintenanceData?.success && maintenanceData?.data) {
      setMaintenanceRequests(maintenanceData.data);
    }
  }, [maintenanceData]);

  const loadContracts = async (studentId: number) => {
    try {
      const contractResponse = await contractApi.getContractsByStudent(
        studentId
      );

      if (contractResponse.data) {
        setContracts(contractResponse.data || []);
      } else {
        setContracts([]);
      }
    } catch (error) {
      console.error("Error loading contracts:", error);
    }
  };

  const handleMaintenanceRequest = () => {
    setIsMaintenanceModalVisible(true);
  };

  const handleMaintenanceSubmit = () => {
    message.success("Yêu cầu bảo trì đã được gửi");
    setIsMaintenanceModalVisible(false);
    // Refresh maintenance requests data
    refetchMaintenance();
  };

  // Navigation handlers
  const navigateToContracts = () => {
    router.push("/sinh-vien/hop-dong");
  };

  const navigateToInvoices = () => {
    router.push("/sinh-vien/hoa-don");
  };

  const navigateToMaintenance = () => {
    router.push("/sinh-vien/bao-tri");
  };

  // Count active contracts
  const activeContractsCount = contracts.filter(
    (c) => c.status === "active"
  ).length;

  // Count pending invoices
  const pendingInvoicesCount = invoices.filter(
    (i) => i.paymentStatus === "pending" || i.paymentStatus === "overdue"
  ).length;

  // Count pending maintenance requests
  const pendingMaintenanceCount = maintenanceRequests.filter(
    (m) => m.status === "pending" || m.status === "processing"
  ).length;

  if (isStudentLoading || isInvoiceLoading || isMaintenanceLoading || loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ background: "transparent" }}>
      <Content>
        {/* Thông tin sinh viên */}
        <div className="relative">
          <StudentCard
            student={user || null}
            onClick={() => setProfileDrawerVisible(true)}
          />
        </div>

        {/* Thống kê và thông tin tóm tắt */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            {roomData ? (
              <HomeRoomCard
                roomNumber={roomData.roomNumber || ""}
                buildingName={roomData.buildingName || ""}
              />
            ) : (
              <HomeRoomCard
                roomNumber="Chưa có"
                buildingName="Chưa phân phòng"
              />
            )}
          </Col>
          <Col xs={24} sm={12} md={6}>
            <HomeContractCard
              count={contracts.length}
              activeCount={activeContractsCount}
              onClick={navigateToContracts}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <InvoiceCard
              pendingCount={pendingInvoicesCount}
              totalCount={invoices.length}
              onClick={navigateToInvoices}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <MaintenanceCard
              pendingCount={pendingMaintenanceCount}
              totalCount={maintenanceRequests.length}
              onClick={navigateToMaintenance}
            />
          </Col>
        </Row>

        {/* Thông tin chi tiết */}
        <Row gutter={[16, 16]}>
          {/* Cột thông tin phòng và hợp đồng */}
          <Col xs={24} md={8}>
            <RoomCard
              roomData={roomData}
              onRegisterRoom={() =>
                message.info("Tính năng đăng ký phòng sẽ sớm được cập nhật")
              }
            />
            <ContractCard
              contracts={contracts}
              onViewContractDetail={(id) =>
                router.push(`/sinh-vien/hop-dong?id=${id}`)
              }
            />
          </Col>

          {/* Cột hóa đơn và bảo trì */}
          <Col xs={24} md={16}>
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <Tabs defaultActiveKey="invoices">
                <TabPane
                  tab={
                    <span className="flex items-center">
                      <CreditCardOutlined className="mr-2" /> Hóa đơn
                    </span>
                  }
                  key="invoices"
                >
                  <InvoiceTable
                    invoices={invoices}
                    onViewInvoiceDetail={(id) =>
                      router.push(`/sinh-vien/hoa-don?id=${id}`)
                    }
                    onPayInvoice={(id) =>
                      message.info(
                        `Thanh toán hóa đơn #${id} sẽ sớm được cập nhật`
                      )
                    }
                  />
                  {invoices.length > 0 && (
                    <div className="mt-4 text-right">
                      <a
                        onClick={navigateToInvoices}
                        className="text-orange-500 hover:text-orange-600"
                      >
                        Xem tất cả hóa đơn
                      </a>
                    </div>
                  )}
                </TabPane>
                <TabPane
                  tab={
                    <span className="flex items-center">
                      <ToolOutlined className="mr-2" /> Yêu cầu bảo trì
                    </span>
                  }
                  key="maintenance"
                >
                  <div className="mb-4 flex justify-end">
                    <button
                      onClick={handleMaintenanceRequest}
                      className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
                    >
                      <ToolOutlined className="mr-2" /> Tạo yêu cầu mới
                    </button>
                  </div>
                  <MaintenanceRequestTable
                    maintenanceRequests={maintenanceRequests}
                    onViewDetail={(id) =>
                      router.push(`/sinh-vien/bao-tri?id=${id}`)
                    }
                    onCancelRequest={(id) =>
                      message.success(`Đã hủy yêu cầu #${id}`)
                    }
                  />
                  {maintenanceRequests.length > 0 && (
                    <div className="mt-4 text-right">
                      <a
                        onClick={navigateToMaintenance}
                        className="text-orange-500 hover:text-orange-600"
                      >
                        Xem tất cả yêu cầu
                      </a>
                    </div>
                  )}
                </TabPane>
                <TabPane
                  tab={
                    <span className="flex items-center">
                      <UserOutlined className="mr-2" /> Bạn cùng phòng
                    </span>
                  }
                  key="roommates"
                >
                  {roomData ? (
                    <RoommateList roommates={roommates} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Bạn chưa được phân phòng
                    </div>
                  )}
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>

        {/* Modal tạo yêu cầu bảo trì */}
        <Modal
          title="Yêu cầu bảo trì"
          open={isMaintenanceModalVisible}
          onCancel={() => setIsMaintenanceModalVisible(false)}
          footer={null}
        >
          <MaintenanceRequestForm
            studentId={user?.id}
            roomId={roomData?.roomId}
            onSuccess={handleMaintenanceSubmit}
          />
        </Modal>

        {/* Student Profile Drawer */}
        <StudentProfileDrawer
          open={profileDrawerVisible}
          onClose={() => setProfileDrawerVisible(false)}
          student={user || null}
          onSuccess={() => {
            // Reload student data after successful update
            refetchStudent();
            refetchProfile();
          }}
        />
      </Content>
    </Layout>
  );
};

export default StudentHomePage;
