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
import { formatCurrency } from "@/utils/formatters";
import { sendMail } from "@/api/sendmail";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ContractPreview from "@/components/molecules/ContractPreview";

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
  gender: string;
  hasActiveContract?: boolean;
  email?: string;
  password?: string;
  birthDate?: string;
  address?: string;
  status: string;
}

interface Room {
  id: number;
  roomNumber: string;
  floorNumber: number;
  buildingName: string;
  capacity: number;
  currentOccupancy: number;
  status: "available" | "full" | "maintenance";
  roomType: string;
  pricePerMonth: number;
}

// Cập nhật interface FilterParams
interface FilterParams {
  search: string;
  status: string;
  page: number;
  limit: number;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Đọc các tham số từ URL
  const getParamFromUrl = (paramName: string, defaultValue: any) => {
    const value = searchParams.get(paramName);
    return value ? (paramName === 'page' || paramName === 'limit' ? parseInt(value) : value) : defaultValue;
  };
  
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [pagination, setPagination] = useState<any>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>(getParamFromUrl("search", ""));
  const [inputValue, setInputValue] = useState<string>(getParamFromUrl("search", ""));
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);
  const [detailContract, setDetailContract] = useState<Contract | null>(null);
  const [form] = Form.useForm();
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(getParamFromUrl("status", "all"));
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [depositAmountFormatted, setDepositAmountFormatted] = useState<string>("");
  const [monthlyFeeFormatted, setMonthlyFeeFormatted] = useState<string>("");
  const [page, setPage] = useState<number>(getParamFromUrl("page", 1));
  const [limit, setLimit] = useState<number>(getParamFromUrl("limit", 10));
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const contractRef = React.useRef<HTMLDivElement>(null);

  // Cập nhật URL khi tham số thay đổi
  const updateURL = useCallback((search: string, status: string, currentPage: number, pageSize: number) => {
    const url = new URL(window.location.href);
    
    // Xóa tham số hiện tại
    url.searchParams.delete('search');
    url.searchParams.delete('status');
    url.searchParams.delete('page');
    url.searchParams.delete('limit');
    
    // Thêm tham số mới nếu có giá trị
    if (search) url.searchParams.set('search', search);
    if (status && status !== 'all') url.searchParams.set('status', status);
    if (currentPage > 1) url.searchParams.set('page', currentPage.toString());
    if (pageSize !== 10) url.searchParams.set('limit', pageSize.toString());
    
    // Cập nhật URL mà không làm refresh trang
    window.history.pushState({}, '', url.toString());
  }, []);

  // Áp dụng filter và cập nhật URL
  const applyFilters = useCallback((newParams: Partial<FilterParams>) => {
    const newSearch = newParams.search !== undefined ? newParams.search : searchText;
    const newStatus = newParams.status !== undefined ? newParams.status : statusFilter;
    const newPage = newParams.page !== undefined ? newParams.page : page;
    const newLimit = newParams.limit !== undefined ? newParams.limit : limit;
    
    // Mọi thay đổi filter trừ page và limit đều reset page về 1
    if ((newParams.search !== undefined || newParams.status !== undefined) && newParams.page === undefined) {
      setPage(1);
      updateURL(newSearch, newStatus, 1, newLimit);
    } else {
      // Cập nhật URL với các giá trị mới
      updateURL(newSearch, newStatus, newPage, newLimit);
    }
    
    // Cập nhật state
    if (newParams.search !== undefined) {
      setSearchText(newParams.search);
    }
    
    if (newParams.status !== undefined) {
      setStatusFilter(newParams.status);
    }
    
    if (newParams.page !== undefined) {
      setPage(newParams.page);
    }
    
    if (newParams.limit !== undefined) {
      setLimit(newParams.limit);
    }
  }, [searchText, statusFilter, page, limit, updateURL]);
  
  // Gọi lại API khi search, status, page hoặc limit thay đổi
  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      // Gửi tham số search, status, page và limit lên API
      const response = await contractApi.getAllContracts({
        search: searchText,
        status: statusFilter,
        page,
        limit
      });
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

        // Lưu thông tin phân trang từ response
        if (response.pagination) {
          console.log("Pagination info:", response.pagination);
          setPagination(response.pagination);
        }
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
  }, [searchText, statusFilter, page, limit]);

  // Gọi API khi component mount hoặc khi các dependencies của fetchContracts thay đổi
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Khởi tạo URL từ searchParams khi component mount và khi filter thay đổi
  useEffect(() => {
    updateURL(searchText, statusFilter, page, limit);
  }, [searchText, statusFilter, page, limit, updateURL]);

  // Cập nhật danh sách sinh viên và phòng sau khi có dữ liệu hợp đồng
  useEffect(() => {
    if (!loading) {
      fetchStudents();
      fetchRooms();
    }
  }, [loading, contracts]);

  // Lọc phòng theo giới tính của sinh viên đã chọn
  const getFilteredRooms = (studentId: number) => {
    if (!studentId) return [];

    const selectedStudent = students.find(
      (student) => student.id === studentId
    );
    if (!selectedStudent) return [];

    // Tìm thông tin chi tiết về sinh viên để lấy giới tính
    return rooms.filter((room) => {
      // Lọc phòng còn trống
      const isAvailable =
        room.status !== "full" && room.status !== "maintenance";

      // Lọc theo giới tính sinh viên - phòng
      const matchesGender = selectedStudent.gender === room.roomType;

      return isAvailable && matchesGender;
    });
  };

  // Lắng nghe thay đổi của studentId trong form
  const handleStudentChange = (studentId: number) => {
    const filtered = getFilteredRooms(studentId);
    setFilteredRooms(filtered);

    // Reset giá trị roomId nếu không có trong danh sách phòng lọc
    form.setFieldValue("roomId", undefined);

    // Reset các giá trị liên quan đến phòng
    form.setFieldValue("depositAmount", undefined);
    form.setFieldValue("monthlyFee", undefined);
  };

  // Cập nhật giá tiền khi chọn phòng
  const handleRoomChange = (roomId: number) => {
    const selectedRoom = rooms.find((room) => room.id === roomId);
    if (selectedRoom) {
      // Đặt tiền đặt cọc mặc định là giá phòng
      form.setFieldValue("depositAmount", Number(selectedRoom.pricePerMonth));
      // Đặt tiền hàng tháng mặc định là giá phòng hàng tháng
      form.setFieldValue("monthlyFee", Number(selectedRoom.pricePerMonth));

      // Cập nhật giá trị hiển thị
      setDepositAmountFormatted(
        formatCurrency(Number(selectedRoom.pricePerMonth))
      );
      setMonthlyFeeFormatted(
        formatCurrency(Number(selectedRoom.pricePerMonth))
      );
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
        // Lấy danh sách tất cả các sinh viên
        const allStudents = data.data;

        // Lấy danh sách sinh viên đã có hợp đồng đang active
        const studentsWithActiveContract = contracts
          .filter((contract) => contract.status === "active")
          .map((contract) => contract.studentId);

        console.log(
          "Sinh viên có hợp đồng active:",
          studentsWithActiveContract
        );

        // Đánh dấu sinh viên đã có hợp đồng active
        const availableStudents = allStudents.map((student: Student) => ({
          ...student,
          hasActiveContract: studentsWithActiveContract.includes(student.id),
        }));

        setStudents(availableStudents);
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

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      applyFilters({ search: value });
    }, 500),
    [applyFilters]
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleSearchButtonClick = (value: string) => {
    applyFilters({ search: value });
  };

  const handleStatusFilter = (value: string) => {
    applyFilters({ status: value });
  };

  const showModal = (contract: Contract | null = null) => {
    setEditingContract(contract);

    if (contract) {
      form.setFieldsValue({
        studentId: contract.studentId,
        roomId: contract.roomId,
        dateRange: [
          parseDateString(contract.startDate),
          parseDateString(contract.endDate),
        ],
        depositAmount: Number(contract.depositAmount),
        monthlyFee: Number(contract.monthlyFee),
        status: contract.status,
      });

      // Cập nhật hiển thị giá trị tiền
      setDepositAmountFormatted(formatCurrency(Number(contract.depositAmount)));
      setMonthlyFeeFormatted(formatCurrency(Number(contract.monthlyFee)));

      // Lọc phòng theo giới tính khi chỉnh sửa
      handleStudentChange(contract.studentId);

      // Log ra giá trị form để debug
      setTimeout(() => {
        console.log("Form values after set:", form.getFieldsValue());
      }, 100);
    } else {
      // Reset form for new contract
      form.resetFields();
      setFilteredRooms([]);
      setDepositAmountFormatted("");
      setMonthlyFeeFormatted("");
    }

    setIsModalVisible(true);
  };

  // Đảm bảo form được cập nhật khi modal hiển thị
  useEffect(() => {
    if (isModalVisible && editingContract) {
      // Cập nhật lại form values sau khi modal hiển thị
      form.setFieldsValue({
        studentId: editingContract.studentId,
        roomId: editingContract.roomId,
        dateRange: [
          parseDateString(editingContract.startDate),
          parseDateString(editingContract.endDate),
        ],
        depositAmount: Number(editingContract.depositAmount),
        monthlyFee: Number(editingContract.monthlyFee),
        status: editingContract.status,
      });

      // Cập nhật giá trị tiền
      setDepositAmountFormatted(formatCurrency(editingContract.depositAmount));
      setMonthlyFeeFormatted(formatCurrency(editingContract.monthlyFee));
    }
  }, [isModalVisible, editingContract]);

  // Cập nhật hiển thị tiền khi form thay đổi
  useEffect(() => {
    // Cập nhật định dạng tiền khi form thay đổi
    const updateFormattedValues = () => {
      const depositAmount = form.getFieldValue("depositAmount");
      const monthlyFee = form.getFieldValue("monthlyFee");

      setDepositAmountFormatted(formatCurrency(Number(depositAmount)));
      setMonthlyFeeFormatted(formatCurrency(Number(monthlyFee)));
    };

    // Gọi ngay lần đầu
    updateFormattedValues();
  }, [form]);

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

      // Ensure dates are properly formatted as YYYY-MM-DD for the backend
      const formattedStartDate = startDate.format(DATE_FORMAT_API);
      const formattedEndDate = endDate.format(DATE_FORMAT_API);

      // Prepare contract data with all fields
      interface ContractDataSubmit {
        studentId: number;
        roomId: number;
        startDate: string;
        endDate: string;
        depositAmount: number;
        monthlyFee: number;
        status?: "active" | "expired" | "terminated";
      }

      const contractData: ContractDataSubmit = {
        studentId: values.studentId,
        roomId: values.roomId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        depositAmount: Number(values.depositAmount),
        monthlyFee: Number(values.monthlyFee),
      };

      // Only add status when editing, not for new contracts
      if (editingContract) {
        contractData.status = values.status;
      }

      if (editingContract) {
        // Update existing contract
        const response = await contractApi.updateContract(
          editingContract.id,
          contractData
        );
        const student = students.find(
          (student) => student.id === contractData.studentId
        );
        const to = {
          Email: student?.email ?? "",
          Name: student?.fullName ?? "",
        };
        const subject = "Cập nhật hợp đồng thành công";
        const text = "Cập nhật hợp đồng thành công";
        const html = `<span>Cập nhật hợp đồng thành công cho sinh viên ${student?.fullName}. Vui lòng truy cập vào trang web để xem thông tin hợp đồng: <a href="https://ktx-student.vercel.app/">Website quản lý sinh viên</a> để xem thông tin hợp đồng.</span>
        <span>Xin chân thành cảm ơn!</span>
        `;
        sendMail(to, subject, text, html);
        notification.success({
          message: "Thành công",
          description: "Cập nhật hợp đồng thành công",
        });
      } else {
        // Create new contract
        const response = await contractApi.createContract(contractData);
        const student = students.find(
          (student) => student.id === contractData.studentId
        );
        const to = {
          Email: student?.email ?? "",
          Name: student?.fullName ?? "",
        };
        const subject = "Tạo hợp đồng thành công";
        const text = "Tạo hợp đồng thành công";
        const html = `<span>Tạo hợp đồng thành công cho sinh viên ${student?.fullName}. Vui lòng truy cập vào trang web để xem thông tin hợp đồng: <a href="https://ktx-student.vercel.app/">Website quản lý sinh viên</a> để xem thông tin hợp đồng.</span>
        <span>Xin chân thành cảm ơn!</span>
        `;
        sendMail(to, subject, text, html);
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
  console.log("contracts", contracts);
  const handleDeleteContract = async (contractId: number) => {
    try {
      await contractApi.deleteContract(contractId);
      notification.success({
        message: "Thành công",
        description: "Xóa hợp đồng thành công",
      });
      const studentId = contracts.find(
        (contract) => contract.id === contractId
      )?.studentId;
      const student = students.find((student) => student.id === studentId);
      const to = {
        Email: student?.email ?? "",
        Name: student?.fullName ?? "",
      };
      const subject = "Hủy hợp đồng thành công";
      const text = "Hủy hợp đồng thành công";
      const html = `<span>Hủy hợp đồng thành công cho sinh viên ${student?.fullName}. Vui lòng truy cập vào trang web để xem thông tin hợp đồng: <a href="https://ktx-student.vercel.app/">Website quản lý sinh viên</a> để xem thông tin hợp đồng.</span>
      <span>Xin chân thành cảm ơn!</span>
      `;
      sendMail(to, subject, text, html);
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
    // Implementation for printing contraTaict
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
        fee ? `${Number(fee).toLocaleString("vi-VN")} VNĐ` : "",
   
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

  // Thêm hàm xuất excel
  const exportToExcel = () => {
    // Chuyển đổi dữ liệu hợp đồng sang định dạng phù hợp
    const dataToExport = contracts.map((contract) => ({
      "Mã hợp đồng": contract.contractNumber,
      "Tên sinh viên": contract.fullName,
      "Mã sinh viên": contract.studentCode,
      "Phòng": contract.roomNumber,
      "Tầng": contract.floorNumber,
      "Tòa": contract.buildingName,
      "Ngày bắt đầu": contract.startDate,
      "Ngày kết thúc": contract.endDate,
      "Tiền đặt cọc": contract.depositAmount,
      "Phí hàng tháng": contract.monthlyFee,
      "Trạng thái":
        contract.status === "active"
          ? "Đang hiệu lực"
          : contract.status === "expired"
          ? "Hết hạn"
          : contract.status === "terminated"
          ? "Đã hủy"
          : contract.status,
    }));

    // Tạo worksheet và workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hợp đồng");

    // Xuất file
    XLSX.writeFile(workbook, "danh_sach_hop_dong.xlsx");
  };

  // Hàm tải hợp đồng PDF
  const handleDownloadContract = async () => {
    if (!contractRef.current || !detailContract) return;
    try {
      setDetailLoading(true);
      const canvas = await html2canvas(contractRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );
      pdf.save(`hop-dong-${detailContract.contractNumber}.pdf`);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải hợp đồng. Vui lòng thử lại sau.",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="contract-page p-2 sm:p-4 md:p-6">
      <Card className="rounded-lg shadow-sm">
        <Title level={2} className=" mb-4 text-lg md:text-2xl">Quản lý hợp đồng</Title>

        <Row gutter={[12, 12]} className="mb-4">
          <Col xs={24} sm={12} md={6} lg={6} className="mb-2">
            <Input.Search
              placeholder="Tìm theo mã HĐ, mã SV, tên SV, phòng..."
              value={inputValue}
              onChange={handleSearchInputChange}
              onSearch={handleSearchButtonClick}
              allowClear
              className="w-full"
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} className="mb-2">
            <Select
              style={{ width: "100%" }}
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={handleStatusFilter}
              className="w-full"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Đang hiệu lực</Option>
              <Option value="expired">Hết hạn</Option>
              <Option value="terminated">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} className="mb-2 flex flex-wrap gap-2 justify-end">
            <Space wrap size={[8, 8]}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                className="min-w-[120px]"
              >
                Thêm hợp đồng
              </Button>
              <Button icon={<ReloadOutlined />} onClick={fetchContracts} className="min-w-[90px]">
                Làm mới
              </Button>
              <Button onClick={exportToExcel} icon={<FileTextOutlined />} className="min-w-[110px]">
                Xuất Excel
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          dataSource={contracts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: pagination.totalItems || contracts?.length || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng cộng ${total} hợp đồng`,
            onChange: (newPage, newPageSize) => {
              applyFilters({ page: newPage, limit: newPageSize });
            }
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
        width={typeof window !== 'undefined' && window.innerWidth < 600 ? '98vw' : 700}
        destroyOnClose
        bodyStyle={{ padding: 12 }}
        style={{ top: 20 }}
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
                  onChange={handleStudentChange}
                  disabled={!!editingContract}
                >
                  {students
                    .filter(
                      (student) =>
                        student.status === "active" &&
                        (!student.hasActiveContract ||
                          (editingContract && student.id === editingContract.studentId))
                    )
                    .map((student) => (
                      <Option key={student.id} value={student.id}>
                        {student.fullName} ({student.studentCode})
                        {student.hasActiveContract && (
                          <Tag color="orange" style={{ marginLeft: 8 }}>
                            Đã có hợp đồng
                          </Tag>
                        )}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomId"
                label="Phòng (Phù hợp với giới tính sinh viên)"
                rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
              >
                <Select
                  placeholder="Chọn phòng"
                  showSearch
                  optionFilterProp="children"
                  onChange={handleRoomChange}
                >
                  {filteredRooms.map((room) => (
                    <Option key={room.id} value={room.id}>
                      {room.roomNumber} (Tầng {room.floorNumber}, Tòa{" "}
                      {room.buildingName}) - {room.currentOccupancy}/
                      {room.capacity} chỗ (
                      {room.roomType === "male" ? "Nam" : "Nữ"})
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
                <Input
                  type="number"
                  placeholder="Nhập số tiền đặt cọc"
                  className="bg-gray-100"
                />
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
                <Input
                  type="number"
                  placeholder="Nhập phí hàng tháng"
                  disabled={true}
                  className="bg-gray-100"
                />
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
        width={typeof window !== 'undefined' && window.innerWidth < 600 ? '98vw' : 700}
        style={{ top: 20 }}
        footer={[
          <Button key="close" onClick={handleDetailCancel}>
            Đóng
          </Button>,
          <Button
            key="preview"
            onClick={() => setIsPreviewVisible(true)}
            type="default"
          >
            Xem hợp đồng
          </Button>,
          // <Button
          //   key="download"
          //   type="primary"
          //   onClick={handleDownloadContract}
          //   loading={detailLoading}
          //   style={{ background: "#fa8c16", borderColor: "#fa8c16" }}
          // >
          //   Tải hợp đồng
          // </Button>,
          // <Button
          //   key="print"
          //   icon={<PrinterOutlined />}
          //   onClick={() => detailContract && handlePrintContract(detailContract.id)}
          // >
          //   In hợp đồng
          // </Button>,
        ]}
        bodyStyle={{ padding: 12 }}
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
                {Number(detailContract.depositAmount).toLocaleString("vi-VN")}{" "}
                VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Phí hàng tháng">
                {Number(detailContract.monthlyFee).toLocaleString("vi-VN")} VNĐ
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

      {/* Modal xem trước hợp đồng */}
      <Modal
        title="Xem trước hợp đồng"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        width={typeof window !== 'undefined' && window.innerWidth < 600 ? '98vw' : 800}
        footer={[
          <Button key="close" onClick={() => setIsPreviewVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="download"
            type="primary"
            onClick={handleDownloadContract}
            loading={detailLoading}
            style={{ background: "#fa8c16", borderColor: "#fa8c16" }}
          >
            Tải hợp đồng
          </Button>,
        ]}
      >
        <div ref={contractRef}>
          {detailContract && (
            <ContractPreview
              contractData={{
                contractNumber: detailContract.contractNumber || "",
                studentName: detailContract.fullName || "",
                studentId: detailContract.studentCode || "",
                roomNumber: detailContract.roomNumber || "",
                buildingName: detailContract.buildingName || "",
                startDate: detailContract.startDate || "",
                endDate: detailContract.endDate || "",
                depositAmount: detailContract.depositAmount || 0,
                monthlyFee: detailContract.monthlyFee || 0,
                studentCode: detailContract.studentCode || "",
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ContractPage;
