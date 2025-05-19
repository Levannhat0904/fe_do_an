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
} from "@ant-design/icons";
import dayjs from "dayjs";
import roomApi, { RoomDetail, TimelineItem } from "@/api/room";
import invoiceApi from "@/api/invoice";
import { DATE_FORMAT, DATE_FORMAT_API, MONTH_FORMAT } from "../../billPage";
import { StatusEnum } from "@/constants/enums";

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

  const getRoomStatusTag = (status: string) => {
    switch (status) {
      case "available":
        return <Tag color="green">Còn trống</Tag>;
      case "full":
        return <Tag color="blue">Đã đầy</Tag>;
      case "maintenance":
        return <Tag color="pink">Đang bảo trì</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
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

  // Column definitions for residents table
  const residentColumns = [
    {
      title: "Mã SV",
      dataIndex: "studentCode",
      key: "studentCode",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => (gender === "male" ? "Nam" : "Nữ"),
    },
    {
      title: "Giường",
      dataIndex: "bedNumber",
      key: "bedNumber",
    },
    {
      title: "Ngày vào",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Ngày ra dự kiến",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => {
        if (status === "paid") {
          return <Badge status="success" text="Đã thanh toán" />;
        } else if (status === "partial") {
          return <Badge status="warning" text="Thanh toán một phần" />;
        } else {
          return <Badge status="error" text="Chưa thanh toán" />;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: any) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => showRemoveConfirm(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Column definitions for maintenance history table
  const maintenanceColumns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        switch (type) {
          case "repair":
            return <Tag color="volcano">Sửa chữa</Tag>;
          case "cleaning":
            return <Tag color="green">Vệ sinh</Tag>;
          case "inspection":
            return <Tag color="blue">Kiểm tra</Tag>;
          default:
            return <Tag>{type}</Tag>;
        }
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Chi phí",
      dataIndex: "cost",
      key: "cost",
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: "Nhân viên",
      dataIndex: "staff",
      key: "staff",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "completed") {
          return <Badge status="success" text="Hoàn thành" />;
        } else if (status === "in-progress") {
          return <Badge status="processing" text="Đang thực hiện" />;
        } else {
          return <Badge status="default" text={status} />;
        }
      },
    },
  ];

  // Column definitions for pending requests table
  const requestColumns = [
    {
      title: "Ngày yêu cầu",
      dataIndex: "date",
      key: "date",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        switch (type) {
          case "maintenance":
            return <Tag color="blue">Bảo trì</Tag>;
          case "complaint":
            return <Tag color="red">Khiếu nại</Tag>;
          default:
            return <Tag>{type}</Tag>;
        }
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Người yêu cầu",
      dataIndex: "requestedBy",
      key: "requestedBy",
    },
    {
      title: "Mức độ",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => {
        switch (priority) {
          case "high":
            return <Tag color="red">Cao</Tag>;
          case "medium":
            return <Tag color="orange">Trung bình</Tag>;
          case "low":
            return <Tag color="green">Thấp</Tag>;
          default:
            return <Tag>{priority}</Tag>;
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "pending") {
          return <Badge status="warning" text="Chờ xử lý" />;
        } else if (status === "processing") {
          return <Badge status="processing" text="Đang xử lý" />;
        } else if (status === "completed") {
          return <Badge status="success" text="Hoàn thành" />;
        } else {
          return <Badge status="default" text={status} />;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: any) => (
        <Space size="small">
          {record.status === "pending" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleProcessRequest(record)}
            >
              Xử lý
            </Button>
          )}
          {record.status === "processing" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => handleProcessRequest(record)}
            >
              Hoàn thành
            </Button>
          )}
          <Button size="small" icon={<EditOutlined />}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  // Column definitions for utilities table
  const utilityColumns = [
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
      sorter: (a: any, b: any) =>
        new Date(b.month).getTime() - new Date(a.month).getTime(),
    },
    {
      title: "Điện (kWh)",
      dataIndex: "electricity",
      key: "electricity",
      render: (value: number) => Number(value),
    },
    {
      title: "Nước (m³)",
      dataIndex: "water",
      key: "water",
      render: (value: number) => Number(value),
    },
    {
      title: "Chi phí điện",
      dataIndex: "electricityCost",
      key: "electricityCost",
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: "Chi phí nước",
      dataIndex: "waterCost",
      key: "waterCost",
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: "Phí khác",
      dataIndex: "otherFees",
      key: "otherFees",
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: "Tổng cộng",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => {
        if (status === "paid") {
          return (
            <Badge
              status={StatusEnum.Success as any}
              text={`Đã thanh toán ${
                record.paidDate ? `(${formatDate(record.paidDate)})` : ""
              }`}
            />
          );
        } else if (status === StatusEnum.Pending) {
          return <Badge status="warning" text="Đang chờ thanh toán" />;
        } else if (status === StatusEnum.WaitingForApproval) {
          return <Badge status="warning" text="Chờ duyệt" />;
        } else {
          return <Badge status="error" text="Quá hạn" />;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: any) => (
        <Space size="small">
          {record.status !== "paid" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleUpdatePaymentStatus(record.id)}
              disabled={record.status !== StatusEnum.WaitingForApproval}
            >
              Đánh dấu đã thu
            </Button>
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditInvoice(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            size="small"
            icon={<ExportOutlined />}
            onClick={() => handlePrint(record)}
          >
            Xuất hóa đơn
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <Card>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <Space wrap>
            <Button
              icon={<RollbackOutlined />}
              onClick={() => router.push("/rooms")}
            >
              Quay lại
            </Button>
            <h2 style={{ margin: 0 }}>Chi tiết phòng {room.roomNumber}</h2>
            {getRoomStatusTag(room.status)}
          </Space>
          <Space wrap>
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={handleEditRoom}
            >
              Chỉnh sửa thông tin
            </Button>
            {room.status === "maintenance" ? (
              <Button
                icon={<CheckCircleOutlined />}
                type="primary"
                onClick={() => handleToggleRoomStatus("available")}
              >
                Kích hoạt lại
              </Button>
            ) : (
              <Button
                icon={<StopOutlined />}
                danger
                onClick={() => handleToggleRoomStatus("maintenance")}
              >
                Đánh dấu bảo trì
              </Button>
            )}
          </Space>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "info",
              label: (
                <span>
                  <HomeOutlined /> Thông tin phòng
                </span>
              ),
              children: (
                <>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={24} lg={16}>
                      <Card title="Thông tin cơ bản" bordered={false}>
                        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
                          <Descriptions.Item label="Tòa nhà">
                            {room.buildingName}
                          </Descriptions.Item>
                          <Descriptions.Item label="Số phòng">
                            {room.roomNumber}
                          </Descriptions.Item>
                          <Descriptions.Item label="Tầng">
                            {room.floorNumber}
                          </Descriptions.Item>
                          <Descriptions.Item label="Diện tích">
                            {room.roomArea ? `${room.roomArea} m²` : "N/A"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Loại phòng">
                            {room.roomType === "male" ? "Nam" : "Nữ"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Sức chứa">
                            {room.occupiedBeds}/{room.capacity} người
                          </Descriptions.Item>
                          <Descriptions.Item label="Giá phòng">
                            {formatCurrency(room.pricePerMonth)}/tháng
                          </Descriptions.Item>
                          <Descriptions.Item label="Ngày tạo">
                            {formatDate(room.createdAt)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Vệ sinh gần nhất">
                            {room.lastCleaned
                              ? formatDate(room.lastCleaned)
                              : "Chưa có"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Bảo trì tiếp theo">
                            {room.nextMaintenance
                              ? formatDate(room.nextMaintenance)
                              : "Chưa lên lịch"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Tiện nghi" span={2}>
                            {room.amenities && room.amenities.length > 0
                              ? (Array.isArray(room.amenities)
                                  ? room.amenities
                                  : typeof room.amenities === "string"
                                  ? JSON.parse(room.amenities)
                                  : []
                                ).map((item: string, index: number) => (
                                  <Tag key={index} color="blue">
                                    {item}
                                  </Tag>
                                ))
                              : "Không có"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Ghi chú" span={2}>
                            {room.notes || "Không có ghi chú"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Mô tả" span={2}>
                            {room.description || "Không có mô tả"}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                      <Card title="Thống kê" bordered={false}>
                        <div style={{ marginBottom: "20px" }}>
                          <div style={{ marginBottom: "8px" }}>
                            Tỷ lệ lấp đầy:
                          </div>
                          <Progress
                            percent={Math.round(
                              (room.occupiedBeds / room.capacity) * 100
                            )}
                            status="active"
                          />
                        </div>

                        <Divider />

                        <Timeline>
                          <Timeline.Item color="green">
                            Vệ sinh gần nhất:{" "}
                            {room.lastCleaned
                              ? formatDate(room.lastCleaned)
                              : "Chưa có"}
                          </Timeline.Item>
                          <Timeline.Item color="blue">
                            Bảo trì gần nhất:{" "}
                            {maintenanceHistory && maintenanceHistory.length > 0
                              ? formatDate(maintenanceHistory[0].date)
                              : "Chưa có"}
                          </Timeline.Item>
                          <Timeline.Item color="red">
                            Bảo trì tiếp theo:{" "}
                            {room.nextMaintenance
                              ? formatDate(room.nextMaintenance)
                              : "Chưa lên lịch"}
                          </Timeline.Item>
                        </Timeline>
                      </Card>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "residents",
              label: (
                <span>
                  <UserOutlined /> Sinh viên ({residents ? residents.length : 0}
                  )
                </span>
              ),
              children: (
                <>
                  <div
                    style={{
                      marginBottom: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3>Danh sách sinh viên</h3>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddResident}
                    >
                      Thêm sinh viên
                    </Button>
                  </div>
                  {residents && residents.length > 0 ? (
                    <Table
                      columns={residentColumns}
                      dataSource={residents}
                      rowKey="id"
                      pagination={false}
                    />
                  ) : (
                    <Empty description="Không có sinh viên trong phòng này" />
                  )}
                </>
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
                <>
                  <Tabs
                    defaultActiveKey="pending"
                    style={{ marginBottom: "16px" }}
                  >
                    <Tabs.TabPane tab="Yêu cầu chờ xử lý" key="pending">
                      <div
                        style={{
                          marginBottom: "16px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={handleAddMaintenance}
                        >
                          Thêm yêu cầu mới
                        </Button>
                      </div>
                      {pendingRequests && pendingRequests.length > 0 ? (
                        <Table
                          columns={requestColumns}
                          dataSource={pendingRequests}
                          rowKey="id"
                          pagination={false}
                        />
                      ) : (
                        <Empty description="Không có yêu cầu bảo trì nào đang chờ xử lý" />
                      )}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Lịch sử bảo trì" key="history">
                      <div
                        style={{
                          marginBottom: "16px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={handleAddMaintenance}
                        >
                          Thêm lịch sử bảo trì
                        </Button>
                      </div>
                      {maintenanceHistory && maintenanceHistory.length > 0 ? (
                        <Table
                          columns={maintenanceColumns}
                          dataSource={maintenanceHistory}
                          rowKey="id"
                          pagination={false}
                        />
                      ) : (
                        <Empty description="Không có lịch sử bảo trì" />
                      )}
                    </Tabs.TabPane>
                  </Tabs>
                </>
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
                <Card
                  title="Hóa đơn tiện ích"
                  extra={
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddUtility}
                    >
                      Thêm hóa đơn
                    </Button>
                  }
                  style={{ marginBottom: "20px" }}
                >
                  <Table
                    columns={utilityColumns}
                    dataSource={sortedUtilities}
                    rowKey="id"
                    size="middle"
                    pagination={false}
                    scroll={{ x: "max-content" }}
                  />
                </Card>
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
                <Card title="Lịch sử hoạt động của phòng" bordered={false}>
                  {isTimelineLoading ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <Spin />
                      <div style={{ marginTop: "8px" }}>
                        Đang tải dữ liệu...
                      </div>
                    </div>
                  ) : timelineData.length > 0 ? (
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
                            {item.userAvatar ? (
                              <Avatar
                                src={item.userAvatar}
                                style={{ marginRight: 8 }}
                              />
                            ) : (
                              <Avatar style={{ marginRight: 8 }}>
                                {item.userName
                                  ? item.userName.charAt(0).toUpperCase()
                                  : "U"}
                              </Avatar>
                            )}
                            <div>
                              <div>
                                <strong>{item.userName}</strong>
                                <Tag
                                  color={
                                    item.userType === "admin" ? "red" : "blue"
                                  }
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
              ),
            },
          ]}
        />
      </Card>

      {/* Edit Room Modal */}
      <Modal
        title="Chỉnh sửa thông tin phòng"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setEditModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveRoom}>
            Lưu thay đổi
          </Button>,
        ]}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roomNumber"
                label="Số phòng"
                rules={[{ required: true, message: "Vui lòng nhập số phòng!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="floor"
                label="Tầng"
                rules={[{ required: true, message: "Vui lòng nhập tầng!" }]}
              >
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Sức chứa"
                rules={[{ required: true, message: "Vui lòng nhập sức chứa!" }]}
              >
                <InputNumber style={{ width: "100%" }} min={1} max={10} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại phòng"
                rules={[
                  { required: true, message: "Vui lòng chọn loại phòng!" },
                ]}
              >
                <Select>
                  <Select.Option value="nam">Nam</Select.Option>
                  <Select.Option value="nữ">Nữ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="monthlyFee"
                label="Giá phòng (VNĐ/tháng)"
                rules={[
                  { required: true, message: "Vui lòng nhập giá phòng!" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  step={100000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: string | undefined): number => {
                    if (!value) return 0;
                    const parsedValue = value.replace(/\$\s?|(,*)/g, "");
                    return Number(parsedValue);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomArea"
                label="Diện tích (m²)"
                rules={[
                  { required: true, message: "Vui lòng nhập diện tích!" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="amenities" label="Tiện nghi">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Chọn hoặc nhập tiện nghi"
            >
              <Select.Option value="Điều hòa">Điều hòa</Select.Option>
              <Select.Option value="Tủ lạnh">Tủ lạnh</Select.Option>
              <Select.Option value="Máy giặt">Máy giặt</Select.Option>
              <Select.Option value="Wifi">Wifi</Select.Option>
              <Select.Option value="Bàn học">Bàn học</Select.Option>
              <Select.Option value="Máy nước nóng">Máy nước nóng</Select.Option>
              <Select.Option value="Tủ quần áo">Tủ quần áo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Resident Modal */}
      <Modal
        title="Thêm sinh viên vào phòng"
        open={addResidentModalVisible}
        onCancel={() => setAddResidentModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setAddResidentModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveResident}>
            Thêm sinh viên
          </Button>,
        ]}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="studentCode"
                label="Mã sinh viên"
                rules={[
                  { required: true, message: "Vui lòng nhập mã sinh viên!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Radio.Group>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bedNumber"
                label="Số giường"
                rules={[
                  { required: true, message: "Vui lòng chọn số giường!" },
                ]}
              >
                <Select>
                  <Select.Option value="01">Giường 01</Select.Option>
                  <Select.Option value="02">Giường 02</Select.Option>
                  <Select.Option value="03">Giường 03</Select.Option>
                  <Select.Option value="04">Giường 04</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="joinDate"
                label="Ngày vào"
                rules={[{ required: true, message: "Vui lòng chọn ngày vào!" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Ngày ra dự kiến"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày ra dự kiến!" },
                ]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Add Maintenance Modal */}
      <Modal
        title="Thêm lịch sử bảo trì"
        open={addMaintenanceModalVisible}
        onCancel={() => setAddMaintenanceModalVisible(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setAddMaintenanceModalVisible(false)}
          >
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveMaintenance}>
            Thêm bảo trì
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày thực hiện"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày thực hiện!" },
                ]}
              >
                <Input type="datetime-local" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại bảo trì"
                rules={[
                  { required: true, message: "Vui lòng chọn loại bảo trì!" },
                ]}
              >
                <Select>
                  <Select.Option value="repair">Sửa chữa</Select.Option>
                  <Select.Option value="cleaning">Vệ sinh</Select.Option>
                  <Select.Option value="inspection">Kiểm tra</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả công việc!" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cost"
                label="Chi phí (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập chi phí!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  step={10000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: string | undefined): number => {
                    if (!value) return 0;
                    const parsedValue = value.replace(/\$\s?|(,*)/g, "");
                    return Number(parsedValue);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="staff"
                label="Nhân viên thực hiện"
                rules={[
                  { required: true, message: "Vui lòng nhập tên nhân viên!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="in-progress">Đang thực hiện</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Utility Modal */}
      <Modal
        title={
          selectedInvoice
            ? "Cập nhật hóa đơn tiện ích"
            : "Thêm hóa đơn tiện ích"
        }
        open={addUtilityModalVisible}
        onCancel={() => {
          setAddUtilityModalVisible(false);
          setSelectedInvoice(null);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setAddUtilityModalVisible(false);
              setSelectedInvoice(null);
            }}
          >
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveUtility}>
            {selectedInvoice ? "Cập nhật" : "Thêm hóa đơn"}
          </Button>,
        ]}
        width={700}
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            name="invoiceMonth"
            label="Kỳ hóa đơn"
            rules={[{ required: true, message: "Vui lòng chọn kỳ hóa đơn" }]}
          >
            <DatePicker
              picker="month"
              format={MONTH_FORMAT}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="electricity"
                label="Số điện (kWh)"
                rules={[{ required: true, message: "Vui lòng nhập số điện" }]}
              >
                <InputNumber
                  min={0}
                  placeholder="Nhập số điện"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="water"
                label="Số nước (m³)"
                rules={[
                  { required: true, message: "Vui lòng nhập số nước" },
                  {
                    validator: (_, value) => {
                      if (value > 9999) {
                        return Promise.reject(
                          "Giá trị số nước quá lớn, tối đa 9,999 m³"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={9999}
                  placeholder="Nhập số nước"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceFee"
                label="Phí dịch vụ (VNĐ)"
                initialValue={100000}
              >
                <InputNumber
                  min={0}
                  placeholder="Nhập phí dịch vụ"
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: string | undefined): number => {
                    if (!value) return 0;
                    const parsedValue = value.replace(/\$\s?|(,*)/g, "");
                    return Number(parsedValue);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Ngày đến hạn"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày đến hạn" },
                ]}
              >
                <DatePicker
                  format={DATE_FORMAT}
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày đến hạn"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomDetailPage;
