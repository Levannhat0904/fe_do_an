import axiosClient from './axiosClient';

const API_URL = '/api/contracts';

interface ContractData {
  studentId: number;
  roomId: number;
  startDate: string;
  endDate: string;
  depositAmount: number;
  monthlyFee: number;
  status?: 'active' | 'expired' | 'terminated';
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const contractApi = {
  // Tạo hợp đồng mới
  createContract: async (data: ContractData): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosClient.post(`${API_URL}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách hợp đồng theo ID sinh viên
  getContractsByStudent: async (studentId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosClient.get(`${API_URL}/students/${studentId}/contracts`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật hợp đồng
  updateContract: async (contractId: number, data: Partial<ContractData>): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosClient.put(`${API_URL}/${contractId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa hợp đồng
  deleteContract: async (contractId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosClient.delete(`${API_URL}/${contractId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả hợp đồng
  getAllContracts: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosClient.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin chi tiết hợp đồng theo ID
  getContractById: async (contractId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosClient.get(`${API_URL}/${contractId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default contractApi;
