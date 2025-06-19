"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  Tabs,
  InputNumber,
  Alert,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import invoiceApi, { Invoice } from "@/api/invoice";
import axiosClient from "@/api/axiosClient";
import buildingApi from "@/api/building";
import roomApi from "@/api/room";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
import * as XLSX from "xlsx";

// Configure dayjs
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("vi");

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Format constants
export const DATE_FORMAT = "DD/MM/YYYY";
export const DATE_FORMAT_API = "YYYY-MM-DD";
export const MONTH_FORMAT = "MM/YYYY";

// Invoice status colors
const statusColors = {
  pending: "orange",
  paid: "green",
  overdue: "red",
  waiting_for_approval: "blue",
};

// Invoice status text
const statusText = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  overdue: "Quá hạn",
  waiting_for_approval: "Chờ duyệt",
};

interface Room {
  id: number;
  roomNumber: string;
  floorNumber: number;
  buildingId: number;
  buildingName: string;
  pricePerMonth: number;
  status: string;
}

interface Building {
  id: number;
  name: string;
}

const BillPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper lấy giá trị từ URL
  const getParamValue = useCallback(
    (key: string, defaultValue: string = "") => {
      const value = searchParams.get(key);
      return value !== null ? value : defaultValue;
    },
    [searchParams]
  );

  // State khởi tạo từ URL
  const [searchText, setSearchText] = useState(getParamValue("search"));
  const [statusFilter, setStatusFilter] = useState(getParamValue("status", "all"));
  const [buildingFilter, setBuildingFilter] = useState<number | null>(
    searchParams.has("building") ? Number(getParamValue("building")) : null
  );
  const [page, setPage] = useState(Number(getParamValue("page", "1")));
  const [limit, setLimit] = useState(Number(getParamValue("limit", "10")));
  const [dateRange, setDateRange] = useState<[
    dayjs.Dayjs | null,
    dayjs.Dayjs | null
  ]>([
    getParamValue("startDate") ? dayjs(getParamValue("startDate")) : null,
    getParamValue("endDate") ? dayjs(getParamValue("endDate")) : null,
  ]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDetailModalVisible, setIsDetailModalVisible] =
    useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectValues, setSelectValues] = useState<{
    [key: number]: undefined;
  }>({});
  const [form] = Form.useForm();
  // State cho thống kê tổng
  const [invoiceStats, setInvoiceStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    waiting_for_approval: 0,
  });

  // Debounce search để tránh lag khi gõ
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchText(value);
      setPage(1);
    }, 500),
    []
  );

  // Hàm cập nhật URL
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchText) params.set("search", searchText);
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
    if (buildingFilter) params.set("building", buildingFilter.toString());
    if (page > 1) params.set("page", page.toString());
    if (limit !== 10) params.set("limit", limit.toString());
    if (dateRange[0]) params.set("startDate", dateRange[0]?.format(DATE_FORMAT_API));
    if (dateRange[1]) params.set("endDate", dateRange[1]?.format(DATE_FORMAT_API));
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";
    router.push(`/quan-ly-hoa-don${url}`, { scroll: false });
  }, [searchText, statusFilter, buildingFilter, page, limit, dateRange, router]);

  // Đồng bộ URL khi state thay đổi
  useEffect(() => {
    updateUrlParams();
  }, [searchText, statusFilter, buildingFilter, page, limit, dateRange, updateUrlParams]);

  // Fetch lại khi filter/search/pagination thay đổi
  useEffect(() => {
    fetchInvoices(page, limit);
  }, [searchText, statusFilter, buildingFilter, page, limit, dateRange]);

  // Fetch data on component mount
  useEffect(() => {
    fetchInvoices();
    fetchRooms();
    fetchBuildings();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchText, statusFilter, buildingFilter]);

  // Khi load trang, gọi API lấy thống kê tổng
  useEffect(() => {
    const fetchStats = async () => {
      const res = await invoiceApi.getInvoiceStats();
      if (res.success) setInvoiceStats(res.data);
    };
    fetchStats();
  }, []);

  // Fetch all invoices with pagination and filters
  const fetchInvoices = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const params: any = {
        page,
        limit,
      };

      // Add filters to params if they exist
      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (buildingFilter) {
        params.buildingId = buildingFilter;
      }

      if (searchText) {
        params.search = searchText;
      }

      if (dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].format(DATE_FORMAT_API);
        params.endDate = dateRange[1].format(DATE_FORMAT_API);
      }

      const response = await invoiceApi.getAllInvoices(params);

      if (response.success) {
        const invoiceData = response.data.invoices || [];
        const formattedInvoices = invoiceData.map((invoice: Invoice) => ({
          ...invoice,
          invoiceMonth: dayjs(invoice.invoiceMonth).format(MONTH_FORMAT),
          dueDate: dayjs(invoice.dueDate).format(DATE_FORMAT),
          paymentDate: invoice.paymentDate
            ? dayjs(invoice.paymentDate).format(DATE_FORMAT)
            : undefined,
        }));

        setInvoices(formattedInvoices);
        setFilteredInvoices(formattedInvoices);

        // Update pagination
        setPagination({
          current: response.data.pagination.page,
          pageSize: response.data.pagination.limit,
          total: response.data.pagination.total,
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách hóa đơn.",
        });
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách hóa đơn.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const response = await roomApi.getRooms();
      // The RoomResponse doesn't have a success property directly,
      // so we check if we have data instead
      if (response && response.data) {
        setRooms(response.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Fetch buildings
  const fetchBuildings = async () => {
    try {
      const response = await buildingApi.getAllBuildings();
      // The BuildingResponse doesn't have a success property directly,
      // access the data property instead
      if (response && response.data) {
        setBuildings(response.data);
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  // Filter invoices based on search, status and building filters
  const filterInvoices = () => {
    let filtered = [...invoices];

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
          (invoice.roomNumber &&
            invoice.roomNumber.toLowerCase().includes(searchLower)) ||
          (invoice.fullName &&
            invoice.fullName.toLowerCase().includes(searchLower)) ||
          (invoice.studentCode &&
            invoice.studentCode.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (invoice) => invoice.paymentStatus === statusFilter
      );
    }

    // Apply building filter
    if (buildingFilter) {
      filtered = filtered.filter(
        (invoice) => invoice.buildingId === buildingFilter
      );
    }

    // Apply date range filter
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((invoice) => {
        const invoiceDate = dayjs(invoice.dueDate, DATE_FORMAT);
        return (
          invoiceDate.isAfter(dateRange[0] as dayjs.Dayjs) &&
          invoiceDate.isBefore((dateRange[1] as dayjs.Dayjs).add(1, "day"))
        );
      });
    }

    setFilteredInvoices(filtered);
  };

  // Handle search input change
  const handleSearch = (value: string) => {
    if (value === "") {
      setSearchText("");
      setPage(1);
      fetchInvoices(1, limit); // Fetch lại ngay khi clear search
    } else {
      debouncedSearch(value);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  // Handle building filter change
  const handleBuildingFilterChange = (value: number | null) => {
    setBuildingFilter(value);
    setPage(1);
  };

  // Handle date range change
  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    setDateRange(dates || [null, null]);
    setPage(1);
  };

  // Show invoice creation modal
  const showCreateModal = () => {
    setSelectedInvoice(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Show invoice edit modal
  const showEditModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);

    // First get detailed invoice data
    fetchInvoiceDetails(invoice.id, true);
  };

  // Show invoice detail modal
  const showDetailModal = (invoice: Invoice) => {
    fetchInvoiceDetails(invoice.id);
  };

  // Close invoice modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedInvoice(null);
  };

  // Close detail modal
  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Calculate fees
      const electricity = Number(values.electricity);
      const water = Number(values.water);
      const electricFee = electricity * 2000; // 2000 VND per kWh
      const waterFee = water * 10000; // 10000 VND per m3
      const roomFee =
        rooms.find((room) => room.id === values.roomId)?.pricePerMonth || 0;
      const serviceFee = Number(values.serviceFee || 100000);
      const totalAmount = roomFee + electricFee + waterFee + serviceFee;

      // Format dates for API
      const invoiceMonth = dayjs(values.invoiceMonth).format(DATE_FORMAT_API);
      const dueDate = dayjs(values.dueDate).format(DATE_FORMAT_API);

      // Create complete invoice data including all required fields
      const invoiceData = {
        roomId: values.roomId,
        invoiceMonth,
        dueDate,
        electricity,
        water,
        electricFee,
        waterFee,
        serviceFee,
        roomFee,
        totalAmount,
      };

      let result;
      const key = "save-invoice";

      notification.open({
        key,
        message: selectedInvoice ? "Đang cập nhật..." : "Đang tạo...",
        description: "Vui lòng đợi trong giây lát...",
        duration: 0,
      });

      if (selectedInvoice) {
        // Update existing invoice
        result = await invoiceApi.updateInvoice(
          selectedInvoice.id,
          invoiceData
        );
        if (result.success) {
          notification.success({
            key,
            message: "Thành công",
            description: "Cập nhật hóa đơn thành công",
          });
        } else {
          throw new Error(
            result.message || "Có lỗi xảy ra khi cập nhật hóa đơn"
          );
        }
      } else {
        // Create new invoice
        result = await invoiceApi.createInvoice(values.roomId, invoiceData);
        if (result.success) {
          notification.success({
            key,
            message: "Thành công",
            description: "Tạo hóa đơn thành công",
          });
        } else {
          throw new Error(result.message || "Có lỗi xảy ra khi tạo hóa đơn");
        }
      }

      setIsModalVisible(false);
      setSelectedInvoice(null);
      fetchInvoices();
      fetchInvoiceStats(); // Fetch lại thống kê tổng
    } catch (error) {
      console.error("Error submitting invoice:", error);
      notification.error({
        message: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lưu hóa đơn",
      });
    }
  };

  // Handle invoice deletion
  const handleDelete = async (id: number) => {
    try {
      await invoiceApi.deleteInvoice(id);
      notification.success({
        message: "Thành công",
        description: "Xóa hóa đơn thành công",
      });
      fetchInvoices(page, limit);
      fetchInvoiceStats(); // Fetch lại thống kê tổng
    } catch (error) {
      console.error("Error deleting invoice:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa hóa đơn",
      });
    }
  };

  // Handle invoice status update
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await invoiceApi.updateInvoiceStatus(id, status);
      notification.success({
        message: "Thành công",
        description: `Cập nhật trạng thái hóa đơn thành "${statusText[status as keyof typeof statusText]}" thành công`,
      });
      fetchInvoices(page, limit);
      fetchInvoiceStats(); // Fetch lại thống kê tổng
    } catch (error) {
      console.error("Error updating invoice status:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật trạng thái hóa đơn",
      });
    }
  };

  // Handle invoice printing
  const handlePrint = (invoice: Invoice) => {
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
  const generateInvoiceHtml = (invoice: Invoice) => {
    const formattedDate = dayjs().format("DD/MM/YYYY HH:mm:ss");
    // const invoiceMonth = dayjs(invoice.invoiceMonth).format("MM/YYYY");
    // const dueDate = dayjs(invoice.dueDate).format("DD/MM/YYYY");
    console.log("invoice.invoiceMonth", invoice.invoiceMonth); //trả ra là 06/2025

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
              <td>${invoice.roomNumber || ""} (Tầng ${invoice.floorNumber || ""}, Tòa ${invoice.buildingName || ""})</td>
            </tr>
            
            <tr>
              <th>Kỳ hóa đơn:</th>
              <td>${invoice.invoiceMonth}</td>
            </tr>
            <tr>
              <th>Ngày đến hạn:</th>
              <td>${invoice.dueDate}</td>
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
              <td>${invoice.paymentDate}</td>
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
                <td style="text-align: right;">${Number(
                  invoice.roomFee
                )?.toLocaleString("vi-VN")} VNĐ</td>
              </tr>
              <tr>
                <td>Tiền điện</td>
                <td>${invoice.electricity} kWh x 2,000 VNĐ</td>
                <td style="text-align: right;">${Number(
                  invoice.electricFee
                )?.toLocaleString("vi-VN")} VNĐ</td>
              </tr>
              <tr>
                <td>Tiền nước</td>
                <td>${invoice.water} m³ x 10,000 VNĐ</td>
                <td style="text-align: right;">${Number(
                  invoice.waterFee
                )?.toLocaleString("vi-VN")} VNĐ</td>
              </tr>
              <tr>
                <td>Phí dịch vụ</td>
                <td></td>
                <td style="text-align: right;">${Number(
                  invoice.serviceFee
                )?.toLocaleString("vi-VN")} VNĐ</td>
              </tr>
            </tbody>
          </table>
          
          <div class="invoice-total">
            <p><strong>Tổng cộng: ${Number(invoice.totalAmount)?.toLocaleString(
              "vi-VN"
            )} VNĐ</strong></p>
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

  // Fetch invoice details by ID
  const fetchInvoiceDetails = async (id: number, forEdit: boolean = false) => {
    try {
      setDetailLoading(true);
      const response = await invoiceApi.getInvoiceById(id);

      if (response.success) {
        const invoice = response.data;

        // Format dates
        const formattedInvoice = {
          ...invoice,
          invoiceMonth: dayjs(invoice.invoiceMonth).format(MONTH_FORMAT),
          dueDate: dayjs(invoice.dueDate).format(DATE_FORMAT),
          paymentDate: invoice.paymentDate
            ? dayjs(invoice.paymentDate).format(DATE_FORMAT)
            : undefined,
        };

        setSelectedInvoice(invoice);

        if (forEdit) {
          // Initialize form with invoice data for editing
          form.setFieldsValue({
            roomId: invoice.roomId,
            invoiceMonth: dayjs(invoice.invoiceMonth),
            electricity:
              invoice.electricity || Math.round(invoice.electricFee / 2000),
            water: invoice.water || Math.round(invoice.waterFee / 10000),
            serviceFee: invoice.serviceFee,
            dueDate: dayjs(invoice.dueDate),
          });
          setIsModalVisible(true);
        } else {
          // Show detail modal
          setIsDetailModalVisible(true);
        }
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải chi tiết hóa đơn.",
        });
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải chi tiết hóa đơn.",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    fetchInvoices(page, limit);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("all");
    setBuildingFilter(null);
    setDateRange([null, null]);
    setPage(1);
    setLimit(10);
  };

  // Handle table pagination change
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  // Thay thế stats = getStatusStats() bằng invoiceStats
  const stats = invoiceStats;

  // Define table columns
  const columns = [
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
    },
    // {
    //   title: "Sinh viên",
    //   key: "student",
    //   render: (_: unknown, record: Invoice) => (
    //     <span>
    //       {record.fullName ? record.fullName : "Chưa có sinh viên"}
    //       {record.studentCode && ` (${record.studentCode})`}
    //     </span>
    //   ),
    // },
    {
      title: "Kỳ hóa đơn",
      dataIndex: "invoiceMonth",
      key: "invoiceMonth",
      sorter: (a: Invoice, b: Invoice) => {
        const aDate = dayjs(a.invoiceMonth, MONTH_FORMAT);
        const bDate = dayjs(b.invoiceMonth, MONTH_FORMAT);
        return aDate.unix() - bDate.unix();
      },
    },
    {
      title: "Ngày đến hạn",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a: Invoice, b: Invoice) => {
        const aDate = dayjs(a.dueDate, DATE_FORMAT);
        const bDate = dayjs(b.dueDate, DATE_FORMAT);
        return aDate.unix() - bDate.unix();
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) =>
        `${Number(amount)?.toLocaleString("vi-VN")} VNĐ`,
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
      render: (_: unknown, record: Invoice) => {
        const handleActionChange = (value: string) => {
          switch (value) {
            case "view":
              showDetailModal(record);
              break;
            case "edit":
              showEditModal(record);
              break;
            case "print":
              handlePrint(record);
              break;
            case "paid":
              handleUpdateStatus(record.id, "paid");
              break;
            case "overdue":
              handleUpdateStatus(record.id, "overdue");
              break;
            case "delete":
              Modal.confirm({
                title: "Xác nhận xóa",
                content: "Bạn có chắc chắn muốn xóa hóa đơn này?",
                okText: "Có",
                cancelText: "Không",
                okType: "danger",
                onOk: () => handleDelete(record.id),
              });
              break;
            default:
              break;
          }
          // Clear select after action
        };

        return (
          <Select
            placeholder="Thao tác"
            size="small"
            style={{ width: 120 }}
            onChange={handleActionChange}
            value={selectValues[record.id] || undefined}
            allowClear
          >
            <Option value="view">
              <EyeOutlined /> Xem
            </Option>
            <Option value="edit">
              <EditOutlined /> Sửa
            </Option>
            <Option value="print">
              <PrinterOutlined /> In
            </Option>
            <Option value="paid">
              <CheckCircleOutlined /> Đã TT
            </Option>
            <Option value="overdue">
              <ExclamationCircleOutlined /> Quá hạn
            </Option>
            <Option value="delete">
              <DeleteOutlined /> Xóa
            </Option>
          </Select>
        );
      },
    },
  ];

  // Hàm fetch lại thống kê tổng
  const fetchInvoiceStats = async () => {
    const res = await invoiceApi.getInvoiceStats();
    if (res.success) setInvoiceStats(res.data);
  };

  // Thêm hàm xuất excel
  const exportToExcel = () => {
    // Chuyển đổi dữ liệu hóa đơn sang định dạng phù hợp
    const dataToExport = filteredInvoices.map((invoice) => ({
      "Mã hóa đơn": invoice.invoiceNumber,
      "Phòng": invoice.roomNumber,
      "Tầng": invoice.floorNumber,
      "Tòa": invoice.buildingName,
      "Kỳ hóa đơn": invoice.invoiceMonth,
      "Ngày đến hạn": invoice.dueDate,
      "Tổng tiền": invoice.totalAmount,
      "Trạng thái": statusText[invoice.paymentStatus] || invoice.paymentStatus,
     
      "Số điện": invoice.electricity,
      "Số nước": invoice.water,
      "Tiền phòng": invoice.roomFee,
      "Tiền điện": invoice.electricFee,
      "Tiền nước": invoice.waterFee,
      "Phí dịch vụ": invoice.serviceFee,
      "Ngày thanh toán": invoice.paymentDate || "",
      "Phương thức thanh toán": invoice.paymentMethod || "",
    }));

    // Tạo worksheet và workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hóa đơn");

    // Xuất file
    XLSX.writeFile(workbook, "danh_sach_hoa_don.xlsx");
  };

  return (
    <div className="bill-page p-2 sm:p-4 md:p-6">
      <Card className="rounded-lg shadow-sm">
        <Title level={2} className="text mb-4 text-lg md:text-2xl">Quản lý hóa đơn</Title>

        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} md={6} className="mb-2">
            <Card className="text-center rounded-lg">
              <Statistic
                title="Tổng số hóa đơn"
                value={stats.total}
                suffix="hóa đơn"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-2">
            <Card
              className="text-center rounded-lg"
              style={{ backgroundColor: "#f6ffed", borderColor: "#b7eb8f" }}
            >
              <Statistic
                title="Đã thanh toán"
                value={stats.paid}
                valueStyle={{ color: "#52c41a" }}
                suffix={`(${stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%)`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-2">
            <Card
              className="text-center rounded-lg"
              style={{ backgroundColor: "#fff7e6", borderColor: "#ffd591" }}
            >
              <Statistic
                title="Chờ thanh toán"
                value={stats.pending}
                valueStyle={{ color: "#fa8c16" }}
                suffix={`(${stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%)`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-2">
            <Card
              className="text-center rounded-lg"
              style={{ backgroundColor: "#fff1f0", borderColor: "#ffa39e" }}
            >
              <Statistic
                title="Quá hạn"
                value={stats.overdue}
                valueStyle={{ color: "#f5222d" }}
                suffix={`(${stats.total > 0 ? Math.round((stats.overdue / stats.total) * 100) : 0}%)`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-2">
            <Card
              className="text-center rounded-lg"
              style={{ backgroundColor: "#fff7e6", borderColor: "#ffd591" }}
            >
              <Statistic
                title="Chờ duyệt"
                value={stats.waiting_for_approval}
                valueStyle={{ color: "#fa8c16" }}
                suffix={`(${stats.total > 0 ? Math.round((stats.waiting_for_approval / stats.total) * 100) : 0}%)`}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[12, 12]} className="mb-4">
          <Col xs={24} sm={12} md={6} lg={6} className="mb-2">
            <Input
              placeholder="Tìm theo mã hóa đơn, phòng, sinh viên..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="w-full"
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} className="mb-2">
            <Select
              placeholder="Lọc theo trạng thái"
              onChange={handleStatusFilterChange}
              value={statusFilter}
              className="w-full"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="pending">Chờ thanh toán</Option>
              <Option value="paid">Đã thanh toán</Option>
              <Option value="overdue">Quá hạn</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} className="mb-2">
            <Select
              placeholder="Lọc theo tòa nhà"
              onChange={handleBuildingFilterChange}
              value={buildingFilter}
              allowClear
              className="w-full"
            >
              {buildings.map((building) => (
                <Option key={building.id} value={building.id}>
                  {building.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} className="mb-2">
            <DatePicker.RangePicker
              placeholder={["Từ ngày", "Đến ngày"]}
              format={DATE_FORMAT}
              onChange={handleDateRangeChange}
              className="w-full"
              allowClear
              suffixIcon={<CalendarOutlined />}
              value={dateRange}
            />
          </Col>
        </Row>

        <Row gutter={[8, 8]} className="mb-4">
          <Col xs={24} className="flex flex-wrap gap-2 justify-end">
            <Space wrap size={[8, 8]}>
              <Button type="primary" onClick={applyFilters} className="min-w-[110px]">
                Áp dụng bộ lọc
              </Button>
              <Button onClick={resetFilters} className="min-w-[90px]">Đặt lại</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showCreateModal}
                className="min-w-[120px]"
              >
                Tạo hóa đơn
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => fetchInvoices()} className="min-w-[90px]">
                Làm mới
              </Button>
              <Button onClick={exportToExcel} icon={<FileTextOutlined />} className="min-w-[110px]">
                Xuất Excel
              </Button>
            </Space>
          </Col>
        </Row>

        <div className="overflow-x-hidden rounded-lg border border-gray-200 bg-white">
          <Table
            dataSource={filteredInvoices}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              position: ["bottomLeft"],
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} hóa đơn`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 900 }}
            className="min-w-[600px]"
          />
        </div>
      </Card>

      {/* Invoice Form Modal */}
      <Modal
        title={selectedInvoice ? "Chỉnh sửa hóa đơn" : "Tạo hóa đơn mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={window.innerWidth < 600 ? '98vw' : 700}
        destroyOnClose
        bodyStyle={{ padding: 12 }}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roomId"
                label="Phòng"
                rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
              >
                <Select
                  placeholder="Chọn phòng"
                  showSearch
                  optionFilterProp="children"
                >
                  {rooms.map((room) => (
                    <Option key={room.id} value={room.id}>
                      {room.roomNumber} (Tầng {room.floorNumber},{" "}
                      {room.buildingName})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="invoiceMonth"
                label="Kỳ hóa đơn"
                rules={[
                  { required: true, message: "Vui lòng chọn kỳ hóa đơn" },
                ]}
              >
                <DatePicker
                  picker="month"
                  format={MONTH_FORMAT}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
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
                  parser={(value: string | undefined) => {
                    const parsed = value
                      ? Number(value.replace(/[^\d]/g, ""))
                      : 0;
                    return parsed as any;
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

      {/* Invoice Detail Modal */}
      <Modal
        title="Chi tiết hóa đơn"
        open={isDetailModalVisible}
        onCancel={handleDetailCancel}
        width={window.innerWidth < 600 ? '98vw' : 700}
        style={{ top: 20 }}
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
        bodyStyle={{ padding: 12 }}
      >
        {selectedInvoice ? (
          <div>
            <Divider orientation="left">Thông tin hóa đơn</Divider>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Mã hóa đơn">
                {selectedInvoice.invoiceNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusColors[selectedInvoice.paymentStatus]}>
                  {statusText[selectedInvoice.paymentStatus]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Kỳ hóa đơn">
                {selectedInvoice.invoiceMonth}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đến hạn">
                {selectedInvoice.dueDate}
              </Descriptions.Item>
              {selectedInvoice.paymentDate && (
                <Descriptions.Item label="Ngày thanh toán">
                  {selectedInvoice.paymentDate}
                </Descriptions.Item>
              )}
              {selectedInvoice.paymentMethod && (
                <Descriptions.Item label="Phương thức thanh toán">
                  {selectedInvoice.paymentMethod}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">Chi tiết hóa đơn</Divider>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Tiền phòng">
                {Number(selectedInvoice.roomFee)?.toLocaleString("vi-VN")} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Tiền điện">
                {selectedInvoice.electricity} kWh x 2,000 VNĐ ={" "}
                {Number(selectedInvoice.electricFee)?.toLocaleString("vi-VN")}{" "}
                VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Tiền nước">
                {selectedInvoice.water} m³ x 10,000 VNĐ ={" "}
                {Number(selectedInvoice.waterFee)?.toLocaleString("vi-VN")} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Phí dịch vụ">
                {Number(selectedInvoice.serviceFee)?.toLocaleString("vi-VN")}{" "}
                VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Tổng cộng">
                <Text strong>
                  {Number(selectedInvoice.totalAmount)?.toLocaleString("vi-VN")}{" "}
                  VNĐ
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Thông tin phòng</Divider>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Tòa nhà">
                {selectedInvoice.buildingName}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng">
                {selectedInvoice.roomNumber} (Tầng {selectedInvoice.floorNumber}
                )
              </Descriptions.Item>
            </Descriptions>

            {selectedInvoice.fullName && (
              <>
                <Divider orientation="left">Thông tin sinh viên</Divider>
                <Descriptions bordered size="small" column={2}>
                  <Descriptions.Item label="Họ tên">
                    {selectedInvoice.fullName}
                  </Descriptions.Item>
                  {selectedInvoice.studentCode && (
                    <Descriptions.Item label="Mã sinh viên">
                      {selectedInvoice.studentCode}
                    </Descriptions.Item>
                  )}
                  {selectedInvoice.phoneNumber && (
                    <Descriptions.Item label="Điện thoại">
                      {selectedInvoice.phoneNumber}
                    </Descriptions.Item>
                  )}
                  {selectedInvoice.email && (
                    <Descriptions.Item label="Email">
                      {selectedInvoice.email}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </>
            )}
          </div>
        ) : (
          <div className="text-center p-5">
            {detailLoading ? (
              <div>Đang tải...</div>
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BillPage;

// Helper component for statistics
const Statistic = ({ title, value, suffix, valueStyle }: any) => {
  return (
    <div>
      <div className="text-gray-500">{title}</div>
      <div className="text-2xl font-bold" style={valueStyle}>
        {value} <span className="text-sm">{suffix}</span>
      </div>
    </div>
  );
};
