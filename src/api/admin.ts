// API for admin
// active student
// get all students
// get student by id
// update student status
// create admin
// change password

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosClient from './axiosClient';

const API_URL = "http://localhost:3000/api/";

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

const adminApi = {
  // ... existing code ...

  // Lấy danh sách tất cả yêu cầu bảo trì
  getAllMaintenanceRequests: async (filters: {
    status?: string;
    priority?: string;
    buildingId?: number;
    searchText?: string;
    page?: number;
    limit?: number;
  }): Promise<MaintenanceResponse> => {
    const response = await axiosClient.get(`${API_URL}/admin/maintenance-requests`, {
      params: filters,
    });
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
      `${API_URL}/admin/maintenance-requests/${requestId}`, 
      data
    );
    return response.data;
  },

  // Thêm yêu cầu bảo trì mới
  addMaintenanceRequest: async (formData: FormData) => {
    const response = await axiosClient.post(
      `${API_URL}/admin/maintenance-requests`,
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
      `${API_URL}/admin/maintenance-requests/${requestId}`
    );
    return response.data;
  },
};

export default adminApi;