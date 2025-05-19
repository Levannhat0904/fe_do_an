"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Table,
  Typography,
  Card,
  Space,
  Tag,
  Spin,
  Empty,
  Alert,
  Row,
  Col,
  Descriptions,
  Modal,
  Select,
} from "antd";
import type { ColumnType } from "antd/es/table";
import {
  SearchOutlined,
  PrinterOutlined,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import invoiceApi, { Invoice } from "@/api/invoice";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Configure dayjs
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("vi");

const { Title, Text } = Typography;
const { Option } = Select;

// Format constants
export const DATE_FORMAT = "DD/MM/YYYY";
export const DATE_FORMAT_API = "YYYY-MM-DD";
export const MONTH_FORMAT = "MM/YYYY";

// Invoice status colors
const statusColors = {
  pending: "orange",
  paid: "green",
  overdue: "red",
  waiting_for_approval: "orange",
};

// Invoice status text
const statusText = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  overdue: "Quá hạn",
  waiting_for_approval: "Chờ duyệt",
};

const LookUpBillPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Select dropdown options
  const [studentOptions, setStudentOptions] = useState<
    { value: string; label: string; id: number }[]
  >([]);
  const [roomOptions, setRoomOptions] = useState<
    { value: string; label: string; id: number }[]
  >([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [initialSearchDone, setInitialSearchDone] = useState(false);

  // Handle search student codes
  const handleSearchStudents = useCallback(async (value: string) => {
    if (value.length < 1) return;

    setLoadingStudents(true);
    try {
      const response = await invoiceApi.getStudentCodes(value);
      if (response.success) {
        setStudentOptions(response.data);
      }
    } catch (error) {
      console.error("Error searching students:", error);
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  // Handle search room numbers
  const handleSearchRooms = useCallback(async (value: string) => {
    if (value.length < 1) return;

    setLoadingRooms(true);
    try {
      const response = await invoiceApi.getRoomNumbers(value);
      if (response.success) {
        setRoomOptions(response.data);
      }
    } catch (error) {
      console.error("Error searching rooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  // Handle search form submission
  const handleSearch = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        setError(null);

        // Format date if provided
        const month = values.month ? values.month.format("YYYY-MM") : undefined;

        // Log the search values for debugging
        console.log("Search values:", {
          studentCode: values.studentCode,
          roomNumber: values.roomNumber,
          month,
        });

        const response = await invoiceApi.searchInvoicesPublic({
          studentCode: values.studentCode,
          roomNumber: values.roomNumber,
          month,
          page: 1,
          limit: pagination.pageSize,
        });

        console.log("API response:", response);

        if (response.success) {
          setInvoices(response.data.invoices);
          setPagination({
            current: response.data.pagination.page,
            pageSize: response.data.pagination.limit,
            total: response.data.pagination.total,
          });

          // Show message if no invoices found but the request was successful
          if (response.data.invoices.length === 0) {
            setError(
              response.message ||
                "Không tìm thấy hóa đơn phù hợp với điều kiện tìm kiếm"
            );
          }
        } else {
          setError(response.message || "Không tìm thấy hóa đơn");
          setInvoices([]);
        }
      } catch (err) {
        console.error("Error searching invoices:", err);
        setError("Đã xảy ra lỗi khi tìm kiếm hóa đơn");
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize]
  );

  // Add a validation function to ensure at least one search criteria is provided
  const handleFormSubmit = useCallback(
    (values: any) => {
      // Check if at least one search criteria is provided
      if (!values.studentCode && !values.roomNumber && !values.month) {
        setError(
          "Vui lòng nhập ít nhất một thông tin để tìm kiếm (mã sinh viên, số phòng hoặc tháng)"
        );
        return;
      }

      // Clear any previous error
      setError(null);

      // Proceed with search
      handleSearch(values);
    },
    [handleSearch]
  );

  // Load initial options
  useEffect(() => {
    const loadInitialOptions = async () => {
      if (initialSearchDone) return;

      setLoadingStudents(true);
      setLoadingRooms(true);

      try {
        // Load initial student options
        const studentResponse = await invoiceApi.getStudentCodes();
        if (studentResponse.success) {
          setStudentOptions(studentResponse.data);
        }

        // Load initial room options
        const roomResponse = await invoiceApi.getRoomNumbers();
        if (roomResponse.success) {
          setRoomOptions(roomResponse.data);
        }

        // Check URL parameters to see if we should auto-search
        const urlParams = new URLSearchParams(window.location.search);
        const roomParam = urlParams.get("room");
        const studentParam = urlParams.get("student");
        const monthParam = urlParams.get("month");

        if (roomParam || studentParam || monthParam) {
          const searchValues: any = {};

          if (roomParam) {
            searchValues.roomNumber = roomParam;
          }

          if (studentParam) {
            searchValues.studentCode = studentParam;
          }

          if (monthParam) {
            // Convert YYYY-MM to dayjs for the DatePicker
            searchValues.month = dayjs(monthParam);
          }

          // Set form values
          form.setFieldsValue(searchValues);

          // Auto search with the parameters
          handleFormSubmit(searchValues);
        }

        setInitialSearchDone(true);
      } catch (error) {
        console.error("Error loading initial options:", error);
      } finally {
        setLoadingStudents(false);
        setLoadingRooms(false);
      }
    };

    loadInitialOptions();
  }, [form, handleFormSubmit, initialSearchDone]);

  // Handle table pagination change
  const handleTableChange = useCallback(
    async (pagination: any) => {
      try {
        setLoading(true);
        const values = form.getFieldsValue();

        // Format date if provided
        const month = values.month ? values.month.format("YYYY-MM") : undefined;

        const response = await invoiceApi.searchInvoicesPublic({
          studentCode: values.studentCode,
          roomNumber: values.roomNumber,
          month,
          page: pagination.current,
          limit: pagination.pageSize,
        });

        if (response.success) {
          setInvoices(response.data.invoices);
          setPagination({
            current: response.data.pagination.page,
            pageSize: response.data.pagination.limit,
            total: response.data.pagination.total,
          });
        }
      } catch (err) {
        console.error("Error fetching invoices with pagination:", err);
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  // Show invoice detail modal
  const showDetailModal = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalVisible(true);
  }, []);

  // Close invoice detail modal
  const handleDetailCancel = useCallback(() => {
    setIsDetailModalVisible(false);
    setSelectedInvoice(null);
  }, []);

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "0 VNĐ";
    return `${amount.toLocaleString("vi-VN")} VNĐ`;
  };

  // Generate invoice HTML for printing
  const generateInvoiceHtml = (invoice: Invoice) => {
    const formattedDate = dayjs().format("DD/MM/YYYY HH:mm:ss");
    const invoiceMonth = dayjs(invoice.invoiceMonth).format("MM/YYYY");
    const dueDate = invoice.dueDate
      ? dayjs(invoice.dueDate).format("DD/MM/YYYY")
      : "";

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
              <td>${invoice.fullName || "Chưa có sinh viên"}</td>
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
                <td>${Math.round(Number(invoice.electricity))} kWh</td>
                <td style="text-align: right;">${formatCurrency(
                  invoice.electricFee
                )}</td>
              </tr>
              <tr>
                <td>Tiền nước</td>
                <td>${Math.round(Number(invoice.water))} m³</td>
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

  // Handle invoice printing
  const handlePrint = (invoice: Invoice) => {
    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert(
          "Không thể mở cửa sổ in. Vui lòng kiểm tra cài đặt trình duyệt của bạn."
        );
        return;
      }

      // Generate the invoice HTML
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
      alert("Không thể in hóa đơn. Vui lòng thử lại sau.");
    }
  };

  // Define table columns
  const columns: ColumnType<Invoice>[] = [
    {
      title: "Mã hóa đơn",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      sorter: (a: Invoice, b: Invoice) =>
        a.invoiceNumber.localeCompare(b.invoiceNumber),
    },
    {
      title: "Phòng",
      key: "room",
      render: (_: unknown, record: Invoice) => (
        <span>
          {record.roomNumber} (Tầng {record.floorNumber}, Tòa{" "}
          {record.buildingName})
        </span>
      ),
      responsive: ["md"],
    },
    {
      title: "Sinh viên",
      key: "student",
      render: (_: unknown, record: Invoice) => (
        <span>{record.fullName ? record.fullName : "Chưa có sinh viên"}</span>
      ),
      responsive: ["lg"],
    },
    {
      title: "Kỳ hóa đơn",
      key: "invoiceMonth",
      render: (_: unknown, record: Invoice) => (
        <span>{dayjs(record.invoiceMonth).format(MONTH_FORMAT)}</span>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `${amount.toLocaleString("vi-VN")} VNĐ`,
      sorter: (a: Invoice, b: Invoice) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Trạng thái",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {statusText[status as keyof typeof statusText]}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Invoice) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
            size="small"
          />
          <Button
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(record)}
            size="small"
            type="default"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="look-up-bill-page p-4 sm:p-6">
      <Card>
        <Title level={2}>Tra cứu hóa đơn ký túc xá</Title>
        <Text className="block mb-6">
          Vui lòng nhập ít nhất một trong các thông tin sau để tra cứu hóa đơn
        </Text>

        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="studentCode"
                label="Mã sinh viên"
                rules={[
                  {
                    required: false,
                    message:
                      "Vui lòng nhập mã sinh viên hoặc thông tin khác để tra cứu",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Nhập mã sinh viên"
                  filterOption={false}
                  onSearch={handleSearchStudents}
                  loading={loadingStudents}
                  style={{ width: "100%" }}
                  optionFilterProp="label"
                  allowClear
                  notFoundContent={
                    loadingStudents ? <Spin size="small" /> : "Không tìm thấy"
                  }
                >
                  {studentOptions.map((option) => (
                    <Option
                      key={option.id}
                      value={option.value}
                      label={option.label}
                    >
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="roomNumber"
                label="Số phòng"
                rules={[
                  {
                    required: false,
                    message:
                      "Vui lòng nhập số phòng hoặc thông tin khác để tra cứu",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Nhập số phòng"
                  filterOption={false}
                  onSearch={handleSearchRooms}
                  loading={loadingRooms}
                  style={{ width: "100%" }}
                  optionFilterProp="label"
                  allowClear
                  notFoundContent={
                    loadingRooms ? <Spin size="small" /> : "Không tìm thấy"
                  }
                >
                  {roomOptions.map((option) => (
                    <Option
                      key={option.id}
                      value={option.value}
                      label={option.label}
                    >
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="month"
                label="Tháng"
                rules={[
                  {
                    required: false,
                    message:
                      "Vui lòng chọn tháng hoặc nhập thông tin khác để tra cứu",
                  },
                ]}
              >
                <DatePicker
                  picker="month"
                  format={MONTH_FORMAT}
                  placeholder="Chọn tháng"
                  style={{ width: "100%" }}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-center mt-4">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
              size="large"
            >
              Tra cứu
            </Button>
          </div>
        </Form>

        {error && (
          <Alert
            message="Lỗi tra cứu"
            description={error}
            type="error"
            showIcon
            className="my-4"
          />
        )}

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" tip="Đang tìm kiếm..." />
            </div>
          ) : invoices.length > 0 ? (
            <Table
              dataSource={invoices}
              columns={columns}
              rowKey="id"
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showTotal: (total) => `Tổng cộng ${total} hóa đơn`,
              }}
              onChange={handleTableChange}
              scroll={{ x: "max-content" }}
            />
          ) : (
            <Empty
              description={
                error
                  ? error
                  : "Chưa có dữ liệu hóa đơn. Vui lòng nhập thông tin để tra cứu."
              }
              className="py-12"
            />
          )}
        </div>
      </Card>

      {/* Invoice Detail Modal */}
      <Modal
        title="Chi tiết hóa đơn"
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
            onClick={() => selectedInvoice && handlePrint(selectedInvoice)}
          >
            In hóa đơn
          </Button>,
        ]}
      >
        {selectedInvoice ? (
          <div>
            <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Mã hóa đơn">
                {selectedInvoice.invoiceNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusColors[selectedInvoice.paymentStatus]}>
                  {statusText[selectedInvoice.paymentStatus]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Kỳ hóa đơn">
                {dayjs(selectedInvoice.invoiceMonth).format(MONTH_FORMAT)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đến hạn">
                {dayjs(selectedInvoice.dueDate).format(DATE_FORMAT)}
              </Descriptions.Item>
              {selectedInvoice.paymentDate && (
                <Descriptions.Item label="Ngày thanh toán">
                  {dayjs(selectedInvoice.paymentDate).format(DATE_FORMAT)}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className="mt-4">
              <Descriptions
                title="Chi tiết hóa đơn"
                bordered
                size="small"
                column={1}
              >
                <Descriptions.Item label="Tiền phòng">
                  {formatCurrency(selectedInvoice.roomFee)}
                </Descriptions.Item>
                <Descriptions.Item label="Tiền điện">
                  {selectedInvoice.electricity} kWh ={" "}
                  {formatCurrency(selectedInvoice.electricFee)}
                </Descriptions.Item>
                <Descriptions.Item label="Tiền nước">
                  {selectedInvoice.water} m³ ={" "}
                  {formatCurrency(selectedInvoice.waterFee)}
                </Descriptions.Item>
                <Descriptions.Item label="Phí dịch vụ">
                  {formatCurrency(selectedInvoice.serviceFee)}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng cộng">
                  <Text strong>
                    {formatCurrency(selectedInvoice.totalAmount)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div className="mt-4">
              <Descriptions
                title="Thông tin phòng"
                bordered
                size="small"
                column={{ xs: 1, sm: 2 }}
              >
                <Descriptions.Item label="Tòa nhà">
                  {selectedInvoice.buildingName}
                </Descriptions.Item>
                <Descriptions.Item label="Phòng">
                  {selectedInvoice.roomNumber} (Tầng{" "}
                  {selectedInvoice.floorNumber})
                </Descriptions.Item>
              </Descriptions>
            </div>

            {selectedInvoice.fullName && (
              <div className="mt-4">
                <Descriptions
                  title="Thông tin sinh viên"
                  bordered
                  size="small"
                  column={{ xs: 1, sm: 2 }}
                >
                  <Descriptions.Item label="Sinh viên" span={2}>
                    {selectedInvoice.fullName}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-5">
            {loading ? <Spin /> : <Text>Không có dữ liệu</Text>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LookUpBillPage;
