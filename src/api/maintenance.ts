import axiosClient from './axiosClient';
const API_URL = "http://localhost:3000/api";
interface MaintenanceRequest {
  id: number;
  requestNumber: string;
  roomId: number;
  buildingId: number;
  roomNumber: string;
  buildingName: string;
  date: string;
  type: string;
  description: string;
  priority: string;
  status: string;
  requestedBy: string;
  resolvedAt?: string;
  resolutionNote?: string;
  cost?: number;
  staff?: string;
  images?: string[];
}

interface MaintenanceResponse {
  data: MaintenanceRequest[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const maintenanceApi = {
  // Lấy danh sách tất cả yêu cầu bảo trì
  getAllMaintenanceRequests: async (filters: {
    status?: string;
    priority?: string;
    buildingId?: number;
    searchText?: string;
    page?: number;
    limit?: number;
  }): Promise<MaintenanceResponse> => {
    const response = await axiosClient.get(`${API_URL}/maintenance`, {
      params: filters,
    });
    return response.data;
  },

  // Lấy chi tiết yêu cầu bảo trì
  getMaintenanceRequestDetail: async (requestId: number): Promise<{ data: MaintenanceRequest }> => {
    const response = await axiosClient.get(`${API_URL}/maintenance/${requestId}`);
    return response.data;
  },

  // Xử lý yêu cầu bảo trì
  processMaintenanceRequest: async (
    requestId: number, 
    data: {
      status: string;
      notes?: string;
      cost?: number;
      staff?: string;
    }
  ) => {
    const response = await axiosClient.put(
      `${API_URL}/maintenance/${requestId}`, 
      data
    );
    return response.data;
  },

  // Thêm yêu cầu bảo trì mới
  addMaintenanceRequest: async (formData: FormData) => {
    const response = await axiosClient.post(
      `/api/maintenance`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  // Xóa yêu cầu bảo trì
  deleteMaintenanceRequest: async (requestId: number) => {
    const response = await axiosClient.delete(
      `${API_URL}/maintenance/${requestId}`
    );
    return response.data;
  },
};

export default maintenanceApi;
