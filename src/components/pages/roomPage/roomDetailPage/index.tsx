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
} from "@ant-design/icons";
import dayjs from "dayjs";
import roomApi, { RoomDetail } from "@/api/room";

interface RoomDetailData extends RoomDetail {}

const RoomDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const roomId = Number(params.id);

  const [data, setData] = useState<RoomDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const [activeTab, setActiveTab] = useState("info");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addResidentModalVisible, setAddResidentModalVisible] = useState(false);
  const [addMaintenanceModalVisible, setAddMaintenanceModalVisible] =
    useState(false);
  const [addUtilityModalVisible, setAddUtilityModalVisible] = useState(false);
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

  const handleSaveUtility = async () => {
    try {
      const values = await form.validateFields();
      const key = "addUtility";

      notification.open({
        key,
        message: "Đang thêm...",
        description: "Đang thêm hóa đơn tiện ích",
        duration: 0,
      });

      // Tạo dữ liệu cho API
      const utilityData = {
        roomId: roomId,
        month: values.month,
        electricity: values.electricity,
        water: values.water,
        electricityCost: values.electricityCost,
        waterCost: values.waterCost,
        otherFees: values.otherFees,
        dueDate: values.dueDate,
        status: values.status,
        paidDate: values.status === "paid" ? values.paidDate : null,
      };

      // Gọi API thêm hóa đơn
      const response = await roomApi.addUtility(roomId, utilityData);

      notification.success({
        key,
        message: "Thêm hóa đơn thành công",
        description: `Đã thêm hóa đơn tiện ích tháng ${values.month} cho phòng ${data?.room.roomNumber}`,
      });

      // Refresh dữ liệu
      const updatedData = await roomApi.getRoomDetail(roomId);
      setData(updatedData);

      setAddUtilityModalVisible(false);
    } catch (error) {
      console.error("Error adding utility:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm hóa đơn tiện ích. Vui lòng thử lại.",
      });
    }
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
      await roomApi.updateInvoiceStatus(invoiceId, "paid");
      notification.success({
        message: "Cập nhật thành công",
        description: "Đã cập nhật trạng thái thanh toán của hóa đơn",
        key,
      });

      // Refresh dữ liệu
      const updatedData = await roomApi.getRoomDetail(roomId);
      setData(updatedData);
    } catch (error: any) {
      notification.error({
        message: "Cập nhật thất bại",
        description:
          error.message || "Có lỗi xảy ra khi cập nhật trạng thái hóa đơn",
        key,
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
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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

      // Gọi API patch status room
      await roomApi.updateRoomStatus(roomId, newStatus);

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
    } catch (error) {
      console.error("Error updating room status:", error);
      notification.error({
        message: "Lỗi",
        description:
          "Không thể cập nhật trạng thái phòng. Vui lòng thử lại sau.",
      });
    }
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
    },
    {
      title: "Nước (m³)",
      dataIndex: "water",
      key: "water",
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
              status="success"
              text={`Đã thanh toán ${
                record.paidDate ? `(${formatDate(record.paidDate)})` : ""
              }`}
            />
          );
        } else if (status === "pending") {
          return <Badge status="warning" text="Đang chờ thanh toán" />;
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
            >
              Đánh dấu đã thu
            </Button>
          )}
          <Button size="small" icon={<ExportOutlined />}>
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
                              ? room.amenities.map((item, index) => (
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
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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
        title="Thêm hóa đơn tiện ích"
        open={addUtilityModalVisible}
        onCancel={() => setAddUtilityModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setAddUtilityModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveUtility}>
            Thêm hóa đơn
          </Button>,
        ]}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="month"
            label="Tháng"
            rules={[{ required: true, message: "Vui lòng nhập tháng!" }]}
          >
            <Input placeholder="MM/YYYY" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="electricity"
                label="Chỉ số điện (kWh)"
                rules={[
                  { required: true, message: "Vui lòng nhập chỉ số điện!" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="water"
                label="Chỉ số nước (m³)"
                rules={[
                  { required: true, message: "Vui lòng nhập chỉ số nước!" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="electricityCost"
                label="Chi phí điện (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập chi phí điện!" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  step={10000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="waterCost"
                label="Chi phí nước (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập chi phí nước!" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  step={10000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="otherFees"
            label="Phí khác (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập phí khác!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={10000}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Hạn thanh toán"
                rules={[
                  { required: true, message: "Vui lòng chọn hạn thanh toán!" },
                ]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select>
                  <Select.Option value="pending">Chưa thanh toán</Select.Option>
                  <Select.Option value="paid">Đã thanh toán</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="paidDate"
            label="Ngày thanh toán"
            dependencies={["status"]}
            rules={[
              ({ getFieldValue }) => ({
                required: getFieldValue("status") === "paid",
                message: "Vui lòng chọn ngày thanh toán!",
              }),
            ]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomDetailPage;
