"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  notification,
  Space,
  Modal,
  Form,
  DatePicker,
  Select,
  Tag,
  Card,
  Typography,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Descriptions,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ReloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import contractApi from "@/api/contract";
import axiosClient from "@/api/axiosClient";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Configure dayjs
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("vi");

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Format constants
const DATE_FORMAT = "DD/MM/YYYY";
const DATE_FORMAT_API = "YYYY-MM-DD";

interface Contract {
  id: number;
  contractNumber: string;
  studentId: number;
  roomId: number;
  startDate: string;
  endDate: string;
  depositAmount: number;
  monthlyFee: number;
  status: "active" | "expired" | "terminated";
  fullName?: string;
  studentCode?: string;
  roomNumber?: string;
  floorNumber?: number;
  buildingName?: string;
  phone?: string;
  email?: string;
  faculty?: string;
  className?: string;
}

interface Student {
  id: number;
  fullName: string;
  studentCode: string;
}

interface Room {
  id: number;
  roomNumber: string;
  floorNumber: number;
  buildingName: string;
  capacity: number;
  currentOccupancy: number;
  status: "available" | "full" | "maintenance";
}

// Utility function to parse dates safely
const parseDateString = (dateString: string): dayjs.Dayjs => {
  console.log("Parsing date:", dateString);

  if (!dateString) {
    return dayjs(); // Return current date if no date provided
  }

  // Try parsing with different formats
  let result;

  // Check if it's already in DD/MM/YYYY format
  if (dateString.includes("/")) {
    result = dayjs(dateString, DATE_FORMAT);
    if (result.isValid()) return result;

    // Try reversing for yyyy-mm-dd format
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const reformatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
      result = dayjs(reformatted);
      if (result.isValid()) return result;
    }
  }

  // Try direct parsing
  result = dayjs(dateString);
  if (result.isValid()) return result;

  // Default to current date if all parsing fails
  console.warn(`Failed to parse date: ${dateString}, using current date`);
  return dayjs();
};

const ContractPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDetailModalVisible, setIsDetailModalVisible] =
    useState<boolean>(false);
  const [detailContract, setDetailContract] = useState<Contract | null>(null);
  const [form] = Form.useForm();
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  console.log(rooms);

  // Fetch contracts, students, rooms data
  useEffect(() => {
    fetchContracts();
    fetchStudents();
    fetchRooms();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await contractApi.getAllContracts();
      if (response.success) {
        console.log("Original contract data:", response.data[0]); // Log for debugging

        const formattedContracts = response.data.map((contract: Contract) => {
          // Format dates properly using dayjs
          const startDate = parseDateString(contract.startDate).format(
            DATE_FORMAT
          );
          const endDate = parseDateString(contract.endDate).format(DATE_FORMAT);

          return {
            ...contract,
            key: contract.id,
            startDate,
            endDate,
          };
        });
        console.log("Formatted contract data:", formattedContracts[0]); // Log for debugging
        setContracts(formattedContracts);
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải hợp đồng.",
        });
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải hợp đồng.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContractDetail = async (contractId: number) => {
    try {
      setDetailLoading(true);
      const response = await contractApi.getContractById(contractId);
      if (response.success) {
        // Format dates properly using dayjs
        const startDate = parseDateString(response.data.startDate).format(
          DATE_FORMAT
        );
        const endDate = parseDateString(response.data.endDate).format(
          DATE_FORMAT
        );

        setDetailContract({
          ...response.data,
          startDate,
          endDate,
        });
        setIsDetailModalVisible(true);
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin chi tiết hợp đồng.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải thông tin chi tiết hợp đồng.",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      // Use the axiosClient to maintain consistency
      const response = await axiosClient.get("/api/student");
      const data = await response.data;
      if (data) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      // Use the axiosClient to maintain consistency
      const response = await axiosClient.get("/api/rooms");
      const data = await response.data;
      if (data) {
        setRooms(data.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      (contract.contractNumber &&
        contract.contractNumber
          .toLowerCase()
          .includes(searchText.toLowerCase())) ||
      (contract.studentCode &&
        contract.studentCode
          .toLowerCase()
          .includes(searchText.toLowerCase())) ||
      (contract.fullName &&
        contract.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
      (contract.roomNumber &&
        contract.roomNumber.toLowerCase().includes(searchText.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const showModal = (contract: Contract | null = null) => {
    setEditingContract(contract);

    if (contract) {
      // Set form values for editing
      form.setFieldsValue({
        studentId: contract.studentId,
        roomId: contract.roomId,
        dateRange: [
          parseDateString(contract.startDate),
          parseDateString(contract.endDate),
        ],
        depositAmount: contract.depositAmount,
        monthlyFee: contract.monthlyFee,
        status: contract.status,
      });
    } else {
      // Reset form for new contract
      form.resetFields();
    }

    setIsModalVisible(true);
  };

  const showDetailModal = (contractId: number) => {
    fetchContractDetail(contractId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
    setDetailContract(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange;

      console.log("Date values:", values.dateRange); // Log dates for debugging

      // Ensure dates are properly formatted as YYYY-MM-DD for the backend
      const formattedStartDate = startDate.format(DATE_FORMAT_API);
      const formattedEndDate = endDate.format(DATE_FORMAT_API);

      console.log("Formatted dates:", formattedStartDate, formattedEndDate); // Log formatted dates

      const contractData = {
        studentId: values.studentId,
        roomId: values.roomId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        depositAmount: values.depositAmount,
        monthlyFee: values.monthlyFee,
        status: values.status,
      };

      if (editingContract) {
        // Update existing contract
        await contractApi.updateContract(editingContract.id, contractData);
        notification.success({
          message: "Thành công",
          description: "Cập nhật hợp đồng thành công",
        });
      } else {
        // Create new contract
        await contractApi.createContract(contractData);
        notification.success({
          message: "Thành công",
          description: "Tạo hợp đồng thành công",
        });
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchContracts();
      fetchRooms(); // Refresh room list to update occupancy status
    } catch (error) {
      console.error("Submit error:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi lưu hợp đồng",
      });
    }
  };

  const handleDeleteContract = async (contractId: number) => {
    try {
      await contractApi.deleteContract(contractId);
      notification.success({
        message: "Thành công",
        description: "Xóa hợp đồng thành công",
      });
      fetchContracts();
      fetchRooms(); // Refresh room list to update occupancy status
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa hợp đồng",
      });
    }
  };

  const handlePrintContract = (contractId: number) => {
    // Implementation for printing contract
    notification.info({
      message: "Thông báo",
      description: "Chức năng in hợp đồng đang được phát triển.",
    });
  };

  const columns = [
    {
      title: "Mã hợp đồng",
      dataIndex: "contractNumber",
      key: "contractNumber",
      sorter: (a: Contract, b: Contract) =>
        a.contractNumber.localeCompare(b.contractNumber),
    },
    {
      title: "Sinh viên",
      dataIndex: "fullName",
      key: "fullName",
      render: (_: unknown, record: Contract) =>
        `${record.fullName || ""} (${record.studentCode || ""})`,
    },
    {
      title: "Phòng",
      key: "room",
      render: (_: unknown, record: Contract) =>
        record.roomNumber && record.floorNumber
          ? `${record.roomNumber} (Tầng ${record.floorNumber}, Tòa ${record.buildingName})`
          : "",
    },
    {
      title: "Thời hạn",
      key: "dateRange",
      render: (_: unknown, record: Contract) =>
        `${record.startDate} - ${record.endDate}`,
    },
    {
      title: "Phí hàng tháng",
      dataIndex: "monthlyFee",
      key: "monthlyFee",
      render: (fee: number) =>
        fee ? `${fee.toLocaleString("vi-VN")} VNĐ` : "",
      sorter: (a: Contract, b: Contract) => a.monthlyFee - b.monthlyFee,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "";
        let displayStatus = status;
        switch (status) {
          case "active":
            color = "green";
            displayStatus = "Đang hiệu lực";
            break;
          case "expired":
            color = "orange";
            displayStatus = "Hết hạn";
            break;
          case "terminated":
            color = "red";
            displayStatus = "Đã hủy";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{displayStatus}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Contract) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              type="primary"
              size="small"
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<FileTextOutlined />}
              size="small"
              onClick={() => showDetailModal(record.id)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa hợp đồng này?"
            onConfirm={() => handleDeleteContract(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter available rooms
  const availableRooms = rooms.filter(
    (room) => room.status !== "full" && room.status !== "maintenance"
  );

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hiệu lực";
      case "expired":
        return "Hết hạn";
      case "terminated":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="contract-page">
      <Card>
        <Title level={2}>Quản lý hợp đồng</Title>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Tìm theo mã HĐ, mã SV, tên SV, phòng..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Đang hiệu lực</Option>
              <Option value="expired">Hết hạn</Option>
              <Option value="terminated">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: "right" }}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
              >
                Thêm hợp đồng
              </Button>
              <Button icon={<ReloadOutlined />} onClick={fetchContracts}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          dataSource={filteredContracts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} hợp đồng`,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Contract Form Modal */}
      <Modal
        title={editingContract ? "Chỉnh sửa hợp đồng" : "Thêm hợp đồng mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="studentId"
                label="Sinh viên"
                rules={[{ required: true, message: "Vui lòng chọn sinh viên" }]}
              >
                <Select
                  placeholder="Chọn sinh viên"
                  showSearch
                  optionFilterProp="children"
                >
                  {students.map((student) => (
                    <Option key={student.id} value={student.id}>
                      {student.fullName} ({student.studentCode})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomId"
                label="Phòng (Chỉ hiển thị phòng còn trống)"
                rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
              >
                <Select
                  placeholder="Chọn phòng"
                  showSearch
                  optionFilterProp="children"
                >
                  {availableRooms.map((room) => (
                    <Option key={room.id} value={room.id}>
                      {room.roomNumber} (Tầng {room.floorNumber}, Tòa{" "}
                      {room.buildingName}) -{room.currentOccupancy}/
                      {room.capacity} chỗ
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="dateRange"
                label="Thời hạn hợp đồng"
                rules={[{ required: true, message: "Vui lòng chọn thời hạn" }]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  format={DATE_FORMAT}
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  allowClear={false}
                  showToday
                  disabledDate={(current) => {
                    // Can't select days in the past
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="depositAmount"
                label="Số tiền đặt cọc (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập số tiền đặt cọc" },
                ]}
              >
                <Input type="number" placeholder="Nhập số tiền đặt cọc" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="monthlyFee"
                label="Phí hàng tháng (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập phí hàng tháng" },
                ]}
              >
                <Input type="number" placeholder="Nhập phí hàng tháng" />
              </Form.Item>
            </Col>
          </Row>

          {editingContract && (
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Đang hiệu lực</Option>
                <Option value="expired">Hết hạn</Option>
                <Option value="terminated">Đã hủy</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Contract Detail Modal */}
      <Modal
        title="Chi tiết hợp đồng"
        open={isDetailModalVisible}
        onCancel={handleDetailCancel}
        width={700}
        footer={[
          <Button key="close" onClick={handleDetailCancel}>
            Đóng
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() =>
              detailContract && handlePrintContract(detailContract.id)
            }
          >
            In hợp đồng
          </Button>,
        ]}
      >
        {detailLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Đang tải...
          </div>
        ) : detailContract ? (
          <div>
            <Divider orientation="left">Thông tin hợp đồng</Divider>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Mã hợp đồng">
                {detailContract.contractNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    detailContract.status === "active"
                      ? "green"
                      : detailContract.status === "expired"
                      ? "orange"
                      : "red"
                  }
                >
                  {getStatusText(detailContract.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {detailContract.startDate}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {detailContract.endDate}
              </Descriptions.Item>
              <Descriptions.Item label="Tiền đặt cọc">
                {detailContract.depositAmount?.toLocaleString("vi-VN")} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Phí hàng tháng">
                {detailContract.monthlyFee?.toLocaleString("vi-VN")} VNĐ
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Thông tin sinh viên</Divider>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Họ tên">
                {detailContract.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Mã sinh viên">
                {detailContract.studentCode}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {detailContract.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {detailContract.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Khoa">
                {detailContract.faculty}
              </Descriptions.Item>
              <Descriptions.Item label="Lớp">
                {detailContract.className}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Thông tin phòng</Divider>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Tòa nhà">
                {detailContract.buildingName}
              </Descriptions.Item>
              <Descriptions.Item label="Tầng">
                {detailContract.floorNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng">
                {detailContract.roomNumber}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Không có dữ liệu
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContractPage;
