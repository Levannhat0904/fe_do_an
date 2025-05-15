import axiosClient from './axiosClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';

// We need to match the exact API URL structure in the backend
const API_URL = '/api';

export interface Invoice {
  id: number;
  invoiceNumber: string;
  contractId?: number;
  studentId?: number;
  roomId: number;
  invoiceMonth: string;
  dueDate: string;
  roomFee: number;
  electricFee: number;
  waterFee: number;
  serviceFee: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  paymentDate?: string;
  paymentMethod?: string;
  createdAt: string;

  // Related data
  roomNumber?: string;
  floorNumber?: number;
  buildingName?: string;
  buildingId?: number;
  fullName?: string; // Can contain a list of student names in the case of multiple students
  studentCode?: string;
  electricity?: number; // kWh
  water?: number; // m3
  phoneNumber?: string;
  email?: string;

  // If there are multiple students in the room, this will be set
  roomStudents?: Array<{
    fullName: string;
    studentCode: string;
    studentId: number;
  }>;
}

export interface InvoiceResponse {
  success: boolean;
  message?: string;
  data: {
    room?: {
      id: number;
      roomNumber: string;
      buildingId: number;
      buildingName: string;
    };
    invoices: Invoice[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface InvoiceDetailResponse {
  success: boolean;
  message?: string;
  data: Invoice;
}

const invoiceApi = {
  // Get all invoices with filtering and pagination
  getAllInvoices: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    buildingId?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<InvoiceResponse> => {
    try {
      const response = await axiosClient.get(`${API_URL}/invoices`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return {
        success: false,
        message: "Failed to fetch invoices",
        data: {
          invoices: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        }
      };
    }
  },

  // Get invoices by room
  getInvoicesByRoom: async (roomId: number): Promise<InvoiceResponse> => {
    const response = await axiosClient.get(`${API_URL}/rooms/${roomId}/invoices`);
    return response.data;
  },

  // Get invoice details
  getInvoiceById: async (id: number): Promise<InvoiceDetailResponse> => {
    const response = await axiosClient.get(`${API_URL}/invoices/${id}`);
    return response.data;
  },

  // Create new invoice
  createInvoice: async (roomId: number, invoiceData: any): Promise<InvoiceDetailResponse> => {
    const response = await axiosClient.post(`${API_URL}/rooms/${roomId}/invoices`, invoiceData);
    return response.data;
  },

  // Update invoice (Not currently implemented in the backend)
  updateInvoice: async (id: number, invoiceData: any): Promise<InvoiceDetailResponse> => {
    const response = await axiosClient.patch(`${API_URL}/invoices/${id}`, invoiceData);
    return response.data;
  },

  // Update invoice status
  updateInvoiceStatus: async (id: number, status: string): Promise<InvoiceDetailResponse> => {
    const response = await axiosClient.put(`${API_URL}/invoices/${id}/status`, { status });
    return response.data;
  },

  // Delete invoice
  deleteInvoice: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.delete(`${API_URL}/invoices/${id}`);
    return response.data;
  },

  // Public search invoices without authentication
  searchInvoicesPublic: async (params: {
    studentCode?: string;
    roomNumber?: string;
    month?: string;
    page?: number;
    limit?: number;
  }): Promise<InvoiceResponse> => {
    try {
      const response = await axiosClient.get(`${API_URL}/public/invoices/search`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error("Error searching invoices:", error);
      return {
        success: false,
        message: "Không thể tìm kiếm hóa đơn",
        data: {
          invoices: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        }
      };
    }
  },

  // Get student codes for select component
  getStudentCodes: async (search?: string): Promise<{
    success: boolean;
    data: Array<{ value: string; label: string; id: number; }>;
  }> => {
    try {
      const response = await axiosClient.get(`${API_URL}/public/students/codes`, {
        params: { search }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching student codes:", error);
      return {
        success: false,
        data: []
      };
    }
  },

  // Get room numbers for select component
  getRoomNumbers: async (search?: string): Promise<{
    success: boolean;
    data: Array<{ value: string; label: string; id: number; }>;
  }> => {
    try {
      const response = await axiosClient.get(`${API_URL}/public/rooms/numbers`, {
        params: { search }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching room numbers:", error);
      return {
        success: false,
        data: []
      };
    }
  },

  // Get invoices by student
  getInvoicesByStudent: async (studentId: number): Promise<InvoiceResponse> => {
    try {
      const response = await axiosClient.get(`${API_URL}/students/${studentId}/invoices`);
      return response.data;
    } catch (error) {
      console.error("Error fetching student invoices:", error);
      return {
        success: false,
        message: "Failed to fetch student invoices",
        data: {
          invoices: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        }
      };
    }
  },

  // Get current student's invoices
  getCurrentStudentInvoices: async (): Promise<InvoiceResponse> => {
    try {
      const response = await axiosClient.get(`${API_URL}/student/current/invoices`);
      return response.data;
    } catch (error) {
      console.error("Error fetching current student invoices:", error);
      return {
        success: false,
        message: "Failed to fetch invoices",
        data: {
          invoices: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        }
      };
    }
  },
};

// React Query hooks
export const useGetStudentInvoices = (studentId: number) => {
  return useQuery({
    queryKey: ['studentInvoices', studentId],
    queryFn: () => invoiceApi.getInvoicesByStudent(studentId),
    enabled: !!studentId,
  });
};

export const useGetCurrentStudentInvoices = () => {
  return useQuery({
    queryKey: ['currentStudentInvoices'],
    queryFn: () => invoiceApi.getCurrentStudentInvoices(),
  });
};

export default invoiceApi; 