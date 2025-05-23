"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  Descriptions,
  Button,
  Tabs,
  Tag,
  Space,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Tooltip,
  Row,
  Col,
  Table,
  Badge,
  Progress,
  Divider,
  Empty,
  Timeline,
  Radio,
  InputNumber,
  List,
  Avatar,
  Result,
  DatePicker,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  ToolOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  StopOutlined,
  ExportOutlined,
  DollarCircleOutlined,
  LoadingOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import roomApi, { RoomDetail, TimelineItem } from "@/api/room";
import invoiceApi from "@/api/invoice";
import { DATE_FORMAT, DATE_FORMAT_API, MONTH_FORMAT } from "../../billPage";
import { StatusEnum } from "@/constants/enums";
import {
  RoomInfoTab,
  ResidentsTab,
  MaintenanceTab,
  TimelineTab,
  UtilitiesTab,
} from "./components";
import { RoomDetailTemplate } from "@/components/templates";
import { 
  RoomEditModal, 
  AddResidentModal, 
  AddMaintenanceModal, 
  AddUtilityModal 
} from "@/components/molecules";

interface RoomDetailData extends RoomDetail {}

const RoomDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const roomId = Number(params.id);

  const [data, setData] = useState<RoomDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("info");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addResidentModalVisible, setAddResidentModalVisible] = useState(false);
  const [addMaintenanceModalVisible, setAddMaintenanceModalVisible] =
    useState(false);
  const [addUtilityModalVisible, setAddUtilityModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await roomApi.getRoomDetail(roomId);
        console.log("Room detail data:", response); // Log the response for debugging
        setData(response);
      } catch (err) {
        console.error("Error fetching room detail:", err);
        setError(err);
        notification.error({
          message: "Lỗi",
          description:
            "Không thể tải thông tin chi tiết phòng. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetail();
    }
  }, [roomId]);

  useEffect(() => {
    // When switching to timeline tab, fetch timeline data
    if (activeTab === "timeline") {
      refreshTimelineData();
    }
  }, [activeTab]);

  // Function to refresh timeline data
  const refreshTimelineData = async () => {
    if (!roomId) return;

    try {
      setIsTimelineLoading(true);
      const timelineItems = await roomApi.getRoomTimeline(roomId);
      setTimelineData(timelineItems);
    } catch (error) {
      console.error("Error fetching timeline data:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải lịch sử hoạt động của phòng",
      });
    } finally {
      setIsTimelineLoading(false);
    }
  };

  // Handle edit room
  const handleEditRoom = () => {
    form.setFieldsValue({
      roomNumber: data?.room.roomNumber,
      floor: data?.room.floorNumber,
      capacity: data?.room.capacity,
      type: data?.room.roomType === "male" ? "nam" : "nữ",
      monthlyFee: data?.room.pricePerMonth,
      amenities: data?.room.amenities,
      description: data?.room.description,
      roomArea: data?.room.roomArea,
      notes: data?.room.notes,
    });
    setEditModalVisible(true);
  };

  const handleSaveRoom = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);

      const formData = new FormData();

      // Map form fields to API expected fields
      if (data?.room.buildingId) {
        formData.append("buildingId", data.room.buildingId.toString());
      }

      // Required fields
      formData.append("roomNumber", values.roomNumber);
      formData.append("floorNumber", values.floor.toString());
      formData.append("roomType", values.type === "nam" ? "male" : "female");
      formData.append("capacity", values.capacity.toString());
      formData.append("pricePerMonth", values.monthlyFee.toString());

      // Optional fields
      if (values.description) {
        formData.append("description", values.description);
      }

      if (values.amenities && Array.isArray(values.amenities)) {
        formData.append("amenities", JSON.stringify(values.amenities));
      }

      if (values.notes) {
        formData.append("notes", values.notes);
      }

      if (values.roomArea) {
        formData.append("roomArea", values.roomArea.toString());
      }

      // Keep current status
      if (data?.room.status) {
        formData.append("status", data.room.status);
      }

      // Always keep existing images
      formData.append("keepExisting", "true");

      // Log the form data in a more compatible way
      console.log("Form data to be sent:", Object.fromEntries(formData));

      // Show loading message
      const key = "updateRoom";
      notification.open({
        key,
        message: "Đang cập nhật...",
        description: "Đang cập nhật thông tin phòng",
        duration: 0,
      });

      try {
        const response = await roomApi.updateRoom(roomId, formData);
        console.log("Update response:", response);

        notification.success({
          key,
          message: "Thành công",
          description: "Cập nhật thông tin phòng thành công",
        });

        // Refresh data
        const updatedData = await roomApi.getRoomDetail(roomId);
        setData(updatedData);

        // Refresh timeline data if we're on the timeline tab
        if (activeTab === "timeline") {
          const timelineItems = await roomApi.getRoomTimeline(roomId);
          setTimelineData(timelineItems);
        }

        setEditModalVisible(false);
      } catch (apiError) {
        console.error("API error:", apiError);
        notification.error({
          key,
          message: "Lỗi",
          description: "Không thể cập nhật thông tin phòng. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.error("Form validation error:", error);
      notification.error({
        message: "Lỗi dữ liệu",
        description: "Vui lòng kiểm tra lại thông tin nhập vào",
      });
    }
  };

  // Add resident handler
  const handleAddResident = () => {
    form.resetFields();
    setAddResidentModalVisible(true);
  };

  const handleSaveResident = () => {
    form.validateFields().then((values) => {
      // Call API to add resident
      notification.success({
        message: "Thêm sinh viên thành công",
        description: `Đã thêm sinh viên ${values.fullName} vào phòng ${data?.room.roomNumber}`,
      });
      setAddResidentModalVisible(false);
    });
  };

  // Add maintenance handler
  const handleAddMaintenance = () => {
    form.resetFields();
    setAddMaintenanceModalVisible(true);
  };

  const handleSaveMaintenance = async () => {
    try {
      const values = await form.validateFields();
      const key = "addMaintenance";

      notification.open({
        key,
        message: "Đang thêm...",
        description: "Đang thêm bảo trì mới",
        duration: 0,
      });

      // Tạo dữ liệu cho API
      const maintenanceData = {
        roomId: roomId,
        requestType: values.type,
        description: values.description,
        cost: values.cost,
        staff: values.staff,
        status: values.status,
        date: values.date, // Ngày thực hiện
      };

      // Gọi API thêm bảo trì
      const response = await roomApi.addMaintenance(roomId, maintenanceData);

      notification.success({
        key,
        message: "Thêm bảo trì thành công",
        description: `Đã thêm lịch bảo trì cho phòng ${data?.room.roomNumber}`,
      });

      // Refresh dữ liệu
      const updatedData = await roomApi.getRoomDetail(roomId);
      setData(updatedData);

      // Refresh timeline data if we're on the timeline tab
      if (activeTab === "timeline") {
        const timelineItems = await roomApi.getRoomTimeline(roomId);
        setTimelineData(timelineItems);
      }

      setAddMaintenanceModalVisible(false);
    } catch (error) {
      console.error("Error adding maintenance:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm bảo trì. Vui lòng thử lại.",
      });
    }
  };

  // Add utility handler
  const handleAddUtility = () => {
    form.resetFields();
    setAddUtilityModalVisible(true);
  };

  const handleUpdatePaymentStatus = async (invoiceId: number) => {
    const key = "update-invoice-status";
    notification.open({
      message: "Đang cập nhật trạng thái hóa đơn",
      description: "Vui lòng đợi trong giây lát...",
      icon: <LoadingOutlined />,
      key,
    });

    try {
      // Sử dụng invoiceApi thay vì roomApi
      await invoiceApi.updateInvoiceStatus(invoiceId, "paid");
      notification.success({
        message: "Cập nhật thành công",
        description: "Đã cập nhật trạng thái thanh toán của hóa đơn",
        key,
      });

      // Refresh dữ liệu
      const updatedData = await roomApi.getRoomDetail(roomId);
      setData(updatedData);

      // Refresh timeline data if we're on the timeline tab
      if (activeTab === "timeline") {
        const timelineItems = await roomApi.getRoomTimeline(roomId);
        setTimelineData(timelineItems);
      }
    } catch (error: any) {
      notification.error({
        message: "Cập nhật thất bại",
        description:
          error.message || "Có lỗi xảy ra khi cập nhật trạng thái hóa đơn",
        key,
      });
    }
  };

  // Handle edit invoice
  const handleEditInvoice = async (invoice: any) => {
    try {
      // Get detailed invoice data first
      const response = await invoiceApi.getInvoiceById(invoice.id);
      if (response.success) {
        const invoiceDetail = response.data;

        // Set selected invoice
        form.resetFields();
        form.setFieldsValue({
          invoiceMonth: dayjs(invoiceDetail.invoiceMonth),
          electricity:
            invoiceDetail.electricity ||
            Math.round(invoiceDetail.electricFee / 2000),
          water:
            invoiceDetail.water || Math.round(invoiceDetail.waterFee / 10000),
          serviceFee: invoiceDetail.serviceFee || 100000,
          dueDate: dayjs(invoiceDetail.dueDate),
        });

        setSelectedInvoice(invoiceDetail);
        setAddUtilityModalVisible(true);
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin hóa đơn",
        });
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải thông tin hóa đơn",
      });
    }
  };

  // Update handleSaveUtility to handle both add and update
  const handleSaveUtility = async () => {
    try {
      const values = await form.validateFields();
      const key = selectedInvoice ? "updateUtility" : "addUtility";

      notification.open({
        key,
        message: selectedInvoice ? "Đang cập nhật..." : "Đang thêm...",
        description: selectedInvoice
          ? "Đang cập nhật hóa đơn tiện ích"
          : "Đang thêm hóa đơn tiện ích",
        duration: 0,
      });

      // Calculate utility fees
      const electricity = Number(values.electricity);
      const water = Number(values.water);
      const electricFee = electricity * 2000; // 2000 VND per kWh
      const waterFee = water * 10000; // 10000 VND per m3
      const serviceFee = Number(values.serviceFee || 100000);

      // Get room details if needed
      let roomFee = 0;
      if (selectedInvoice) {
        roomFee = selectedInvoice.roomFee;
      } else if (data?.room) {
        roomFee = data.room.pricePerMonth;
      }

      // Calculate total
      const totalAmount = roomFee + electricFee + waterFee + serviceFee;

      // Tạo dữ liệu cho API
      const invoiceData = {
        invoiceMonth: values.invoiceMonth.format(DATE_FORMAT_API),
        dueDate: values.dueDate.format(DATE_FORMAT_API),
        electricity,
        water,
        electricFee,
        waterFee,
        serviceFee,
        roomFee,
        totalAmount,
      };

      let response;

      if (selectedInvoice) {
        // Update existing invoice
        response = await invoiceApi.updateInvoice(
          selectedInvoice.id,
          invoiceData
        );
      } else {
        // Create new invoice
        response = await invoiceApi.createInvoice(roomId, invoiceData);
      }

      if (response.success) {
        notification.success({
          key,
          message: selectedInvoice
            ? "Cập nhật hóa đơn thành công"
            : "Thêm hóa đơn thành công",
          description: selectedInvoice
            ? `Đã cập nhật hóa đơn tiện ích tháng ${values.invoiceMonth.format(
                MONTH_FORMAT
              )} cho phòng ${data?.room.roomNumber}`
            : `Đã thêm hóa đơn tiện ích tháng ${values.invoiceMonth.format(
                MONTH_FORMAT
              )} cho phòng ${data?.room.roomNumber}`,
        });

        // Refresh dữ liệu
        const updatedData = await roomApi.getRoomDetail(roomId);
        setData(updatedData);

        // Refresh timeline data if we're on the timeline tab
        if (activeTab === "timeline") {
          const timelineItems = await roomApi.getRoomTimeline(roomId);
          setTimelineData(timelineItems);
        }

        setAddUtilityModalVisible(false);
        setSelectedInvoice(null);
      } else {
        throw new Error(response.message || "Có lỗi xảy ra khi xử lý hóa đơn");
      }
    } catch (error) {
      console.error("Error processing utility:", error);
      notification.error({
        message: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Không thể xử lý hóa đơn tiện ích. Vui lòng thử lại.",
      });
    }
  };

  // Handle resident removal
  const showRemoveConfirm = (resident: any) => {
    Modal.confirm({
      title: "Xác nhận xóa sinh viên",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa sinh viên ${resident.fullName} khỏi phòng này?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const key = "removeResident";
          notification.open({
            key,
            message: "Đang xóa...",
            description: "Đang xóa sinh viên khỏi phòng",
            duration: 0,
          });

          // Gọi API xóa sinh viên
          await roomApi.removeResident(roomId, resident.id);

          notification.success({
            key,
            message: "Xóa thành công",
            description: `Đã xóa sinh viên ${resident.fullName} khỏi phòng ${data?.room.roomNumber}`,
          });

          // Refresh dữ liệu
          const updatedData = await roomApi.getRoomDetail(roomId);
          setData(updatedData);

          // Refresh timeline data if we're on the timeline tab
          if (activeTab === "timeline") {
            const timelineItems = await roomApi.getRoomTimeline(roomId);
            setTimelineData(timelineItems);
          }
        } catch (error) {
          console.error("Error removing resident:", error);
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa sinh viên. Vui lòng thử lại.",
          });
        }
      },
    });
  };

  // Handle request processing
  const handleProcessRequest = async (request: any) => {
    Modal.confirm({
      title: "Xử lý yêu cầu",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn ${
        request.status === "pending" ? "xử lý" : "hoàn thành"
      } yêu cầu này?`,
      okText: "Có",
      cancelText: "Không",
      async onOk() {
        try {
          const key = "processRequest";
          notification.open({
            key,
            message: "Đang cập nhật...",
            description: "Đang cập nhật trạng thái yêu cầu",
            duration: 0,
          });

          const newStatus =
            request.status === "pending" ? "processing" : "completed";
          await roomApi.processMaintenanceRequest(request.id, newStatus);

          // Cập nhật trạng thái trong UI trước khi refresh data
          const updatedRequests = pendingRequests.map((req) =>
            req.id === request.id ? { ...req, status: newStatus } : req
          );

          notification.success({
            key,
            message: "Thành công",
            description: "Cập nhật trạng thái yêu cầu thành công",
          });

          // Refresh data
          const updatedData = await roomApi.getRoomDetail(roomId);
          setData(updatedData);

          // Refresh timeline data if we're on the timeline tab
          if (activeTab === "timeline") {
            const timelineItems = await roomApi.getRoomTimeline(roomId);
            setTimelineData(timelineItems);
          }
        } catch (error) {
          console.error("Error processing request:", error);
          notification.error({
            message: "Lỗi",
            description: "Không thể xử lý yêu cầu",
          });
        }
      },
    });
  };

  // Format date
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
  };

  // Thêm hàm xử lý bên trong component RoomDetailPage
  const handleToggleRoomStatus = async (newStatus: string) => {
    try {
      const key = "updateRoomStatus";
      notification.open({
        key,
        message: "Đang cập nhật...",
        description: `Đang ${
          newStatus === "available" ? "kích hoạt" : "chuyển sang chế độ bảo trì"
        } phòng`,
        duration: 0,
      });

      console.log("Updating room status:", {
        roomId,
        newStatus,
        currentStatus: data?.room.status,
      });

      if (!roomId || isNaN(roomId)) {
        notification.error({
          key,
          message: "Lỗi",
          description: "ID phòng không hợp lệ",
        });
        return;
      }

      // Kiểm tra nếu phòng đang chuyển sang bảo trì và đang có sinh viên
      if (newStatus === "maintenance" && residents && residents.length > 0) {
        notification.error({
          key,
          message: "Lỗi",
          description: "Không thể đánh dấu bảo trì khi phòng đang có sinh viên",
        });
        return;
      }

      // Gọi API patch status room
      const response = await roomApi.updateRoomStatus(roomId, newStatus);
      console.log("API response:", response);

      notification.success({
        key,
        message: "Thành công",
        description: `Đã ${
          newStatus === "available" ? "kích hoạt" : "chuyển sang chế độ bảo trì"
        } phòng thành công`,
      });

      // Refresh data
      const updatedData = await roomApi.getRoomDetail(roomId);
      setData(updatedData);

      // Refresh timeline data if we're on the timeline tab
      if (activeTab === "timeline") {
        const timelineItems = await roomApi.getRoomTimeline(roomId);
        setTimelineData(timelineItems);
      }
    } catch (error) {
      console.error("Error updating room status:", error);
      notification.error({
        message: "Lỗi",
        description:
          "Không thể cập nhật trạng thái phòng. Vui lòng thử lại sau.",
      });
    }
  };

  // Handle invoice printing
  const handlePrint = (invoice: any) => {
    try {
      notification.info({
        message: "Đang chuẩn bị in",
        description: `Đang tạo hóa đơn ${invoice.invoiceNumber} để in...`,
        duration: 2,
      });

      // Get invoice details if needed
      if (!invoice.electricFee || !invoice.waterFee) {
        fetchInvoiceDetailsForPrint(invoice.id);
        return;
      }

      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        notification.error({
          message: "Lỗi",
          description:
            "Không thể mở cửa sổ in. Vui lòng kiểm tra cài đặt trình duyệt của bạn.",
        });
        return;
      }

      // Format the invoice data
      const invoiceHtml = generateInvoiceHtml(invoice);

      // Write to the new window
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();

      // Call print after a short delay to ensure content is fully loaded
      setTimeout(() => {
        printWindow.print();
        // Close window after printing (browser dependent)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    } catch (error) {
      console.error("Error printing invoice:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể in hóa đơn. Vui lòng thử lại sau.",
      });
    }
  };

  // Fetch invoice details specifically for printing
  const fetchInvoiceDetailsForPrint = async (id: number) => {
    try {
      const response = await invoiceApi.getInvoiceById(id);
      if (response.success) {
        handlePrint(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin hóa đơn để in.",
        });
      }
    } catch (error) {
      console.error("Error fetching invoice for print:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải thông tin hóa đơn để in.",
      });
    }
  };

  // Generate HTML for invoice printing
  const generateInvoiceHtml = (invoice: any) => {
    const formattedDate = dayjs().format("DD/MM/YYYY HH:mm:ss");
    const invoiceMonth = dayjs(invoice.invoiceMonth).format("MM/YYYY");
    const dueDate = dayjs(invoice.dueDate).format("DD/MM/YYYY");

    const statusText = {
      pending: "Chờ thanh toán",
      paid: "Đã thanh toán",
      overdue: "Quá hạn",
      waiting_for_approval: "Chờ duyệt",
    };

    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <title>Hóa đơn ${invoice.invoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-header h1 {
            color: #1890ff;
            margin-bottom: 5px;
          }
          .invoice-details {
            margin-bottom: 30px;
          }
          .invoice-details table {
            width: 100%;
            border-collapse: collapse;
          }
          .invoice-details th, .invoice-details td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .invoice-items {
            margin-bottom: 30px;
          }
          .invoice-items table {
            width: 100%;
            border-collapse: collapse;
          }
          .invoice-items th, .invoice-items td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .invoice-items th {
            background-color: #f8f8f8;
          }
          .invoice-total {
            text-align: right;
            font-size: 18px;
            margin-top: 20px;
          }
          .invoice-footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          .status {
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
          }
          .status-pending {
            background-color: #fff7e6;
            color: #fa8c16;
          }
          .status-paid {
            background-color: #f6ffed;
            color: #52c41a;
          }
          .status-overdue {
            background-color: #fff1f0;
            color: #f5222d;
          }
          .status-waiting_for_approval {
            background-color: #fff7e6;
            color: #fa8c16;
          }
          @media print {
            body {
              padding: 0;
              font-size: 12pt;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>HÓA ĐƠN KÝ TÚC XÁ</h1>
          <p>Số hóa đơn: ${invoice.invoiceNumber}</p>
          <p>Ngày in: ${formattedDate}</p>
        </div>
        
        <div class="invoice-details">
          <table>
            <tr>
              <th style="width: 30%;">Thông tin phòng:</th>
              <td>${invoice.roomNumber || ""} (Tầng ${
      invoice.floorNumber || ""
    }, Tòa ${invoice.buildingName || ""})</td>
            </tr>
            <tr>
              <th>Sinh viên:</th>
              <td>${invoice.fullName || "Chưa có sinh viên"} ${
      invoice.studentCode ? `(${invoice.studentCode})` : ""
    }</td>
            </tr>
            <tr>
              <th>Kỳ hóa đơn:</th>
              <td>${invoiceMonth}</td>
            </tr>
            <tr>
              <th>Ngày đến hạn:</th>
              <td>${dueDate}</td>
            </tr>
            <tr>
              <th>Trạng thái:</th>
              <td>
                <span class="status status-${invoice.paymentStatus}">
                  ${
                    statusText[invoice.paymentStatus as keyof typeof statusText]
                  }
                </span>
              </td>
            </tr>
            ${
              invoice.paymentDate
                ? `
            <tr>
              <th>Ngày thanh toán:</th>
              <td>${dayjs(invoice.paymentDate).format("DD/MM/YYYY")}</td>
            </tr>`
                : ""
            }
          </table>
        </div>
        
        <div class="invoice-items">
          <h2>Chi tiết hóa đơn</h2>
          <table>
            <thead>
              <tr>
                <th>Mục</th>
                <th>Chi tiết</th>
                <th style="text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tiền phòng</td>
                <td></td>
                <td style="text-align: right;">${formatCurrency(
                  invoice.roomFee
                )}</td>
              </tr>
              <tr>
                <td>Tiền điện</td>
                <td>${invoice.electricity} kWh x 2,000 VNĐ</td>
                <td style="text-align: right;">${formatCurrency(
                  invoice.electricFee
                )}</td>
              </tr>
              <tr>
                <td>Tiền nước</td>
                <td>${invoice.water} m³ x 10,000 VNĐ</td>
                <td style="text-align: right;">${formatCurrency(
                  invoice.waterFee
                )}</td>
              </tr>
              <tr>
                <td>Phí dịch vụ</td>
                <td></td>
                <td style="text-align: right;">${formatCurrency(
                  invoice.serviceFee
                )}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="invoice-total">
            <p><strong>Tổng cộng: ${formatCurrency(
              invoice.totalAmount
            )}</strong></p>
          </div>
        </div>
        
        <div class="invoice-footer">
          <p>Đây là hóa đơn điện tử được in từ hệ thống quản lý ký túc xá.</p>
          <p>Vui lòng liên hệ quản lý nếu có thắc mắc về hóa đơn này.</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()">In hóa đơn</button>
          <button onclick="window.close()">Đóng</button>
        </div>
      </body>
      </html>
    `;
  };

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", margin: "50px" }}>
        <Result
          status="error"
          title="Lỗi tải dữ liệu"
          subTitle="Không thể tải thông tin phòng. Vui lòng thử lại sau."
          extra={
            <Button type="primary" onClick={() => router.push("/rooms")}>
              Quay lại danh sách phòng
            </Button>
          }
        />
      </div>
    );
  }

  if (!data || !data.room) {
    return (
      <div style={{ textAlign: "center", margin: "50px" }}>
        <Result
          status="warning"
          title="Không tìm thấy dữ liệu"
          subTitle="Không có thông tin phòng hoặc dữ liệu không đầy đủ."
          extra={
            <Button type="primary" onClick={() => router.push("/rooms")}>
              Quay lại danh sách phòng
            </Button>
          }
        />
      </div>
    );
  }

  const {
    room,
    residents = [],
    maintenanceHistory = [],
    pendingRequests = [],
    utilities = [],
  } = data;

  // Sort utility bills by creation date (newest first)
  const sortedUtilities = [...utilities].sort((a: any, b: any) => {
    // Use createdAt if available, otherwise use month
    const dateA = a.createdAt
      ? new Date(a.createdAt).getTime()
      : new Date(a.month).getTime();
    const dateB = b.createdAt
      ? new Date(b.createdAt).getTime()
      : new Date(b.month).getTime();
    return dateB - dateA; // Sort descending (newest first)
  });

  return (
    <>
      <RoomDetailTemplate
        isLoading={isLoading}
        error={error}
        data={data}
        activeTab={activeTab}
        timelineData={timelineData}
        isTimelineLoading={isTimelineLoading}
        onBack={() => router.push("/rooms")}
        onTabChange={setActiveTab}
        onEdit={handleEditRoom}
        onToggleStatus={handleToggleRoomStatus}
        onAddResident={handleAddResident}
        onEditResident={() => {}}
        onRemoveResident={showRemoveConfirm}
        onAddMaintenance={handleAddMaintenance}
        onProcessRequest={handleProcessRequest}
        onViewMaintenance={() => {}}
        onAddUtility={handleAddUtility}
        onEditInvoice={handleEditInvoice}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onPrintInvoice={handlePrint}
      />

      <RoomEditModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSave={handleSaveRoom}
        form={form}
      />

      <AddResidentModal
        visible={addResidentModalVisible}
        onCancel={() => setAddResidentModalVisible(false)}
        onSave={handleSaveResident}
        form={form}
      />

      <AddMaintenanceModal
        visible={addMaintenanceModalVisible}
        onCancel={() => setAddMaintenanceModalVisible(false)}
        onSave={handleSaveMaintenance}
        form={form}
      />

      <AddUtilityModal
        visible={addUtilityModalVisible}
        onCancel={() => {
          setAddUtilityModalVisible(false);
          setSelectedInvoice(null);
        }}
        onSave={handleSaveUtility}
        form={form}
        selectedInvoice={selectedInvoice}
        monthFormat={MONTH_FORMAT}
        dateFormat={DATE_FORMAT}
      />
    </>
  );
};

export default RoomDetailPage;
