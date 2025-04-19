import axiosClient from './axiosClient';
import { AxiosRequestConfig } from 'axios';
const API_URL = 'http://localhost:3000/api';
export interface RoomFilters {
  buildingName?: string;
  type?: 'male' | 'female';
  status?: 'active' | 'maintenance';
  searchText?: string;
  availability?: 'available' | 'full';
  page?: number;
  limit?: number;
}

export interface Room {
  id: number;
  buildingId: number;
  buildingName: string;
  roomNumber: string;
  floorNumber: number;
  roomType: string;
  capacity: number;
  occupiedBeds: number;
  pricePerMonth: number;
  description?: string;
  roomImagePath?: string;
  amenities: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomResponse {
  data: Room[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  summary: {
    totalRooms: number;
    availableRooms: number;
    maintenanceRooms: number;
    occupancyRate: number;
  };
}

export interface RoomFormData {
  buildingId: number;
  roomNumber: string;
  floorNumber: number;
  roomType: string;
  capacity: number;
  pricePerMonth: number;
  description?: string;
  amenities?: string[];
  status?: string;
}

export interface RoomDetail {
  room: {
    id: number;
    buildingId: number;
    buildingName: string;
    roomNumber: string;
    floorNumber: number;
    roomType: string;
    capacity: number;
    occupiedBeds: number;
    pricePerMonth: number;
    description?: string;
    roomImagePath?: string;
    amenities: string[];
    status: string;
    lastCleaned?: string;
    nextMaintenance?: string;
    createdAt: string;
    updatedAt: string;
    roomArea?: number;
    notes?: string;
  };
  residents: {
    id: number;
    studentCode: string;
    fullName: string;
    gender: string;
    phone: string;
    email: string;
    status: string;
    joinDate: string;
    endDate: string;
    bedNumber: string;
    paymentStatus: string;
  }[];
  maintenanceHistory: {
    id: number;
    date: string;
    type: string;
    description: string;
    cost: number;
    staff: string;
    status: string;
  }[];
  pendingRequests: {
    id: number;
    date: string;
    type: string;
    description: string;
    requestedBy: string;
    status: string;
    priority: string;
  }[];
  utilities: {
    id: number;
    month: string;
    electricity: number;
    water: number;
    electricityCost: number;
    waterCost: number;
    otherFees: number;
    totalCost: number;
    status: string;
    createdAt?: string;
    paidDate?: string;
  }[];
}

const roomApi = {
  getRooms: async (filters: RoomFilters = {}): Promise<RoomResponse> => {
    const config: AxiosRequestConfig = {
      params: filters
    };
    const response = await axiosClient.get(`${API_URL}/rooms`, config);
    return response.data;
  },

  getRoomById: async (id: number) => {
    const response = await axiosClient.get(`${API_URL}/rooms/${id}`);
    return response.data;
  },

  addRoom: async (formData: FormData) => {
    const response = await axiosClient.post(`${API_URL}/rooms`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateRoom: async (id: number, formData: FormData) => {
    const response = await axiosClient.put(`${API_URL}/rooms/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteRoom: async (id: number) => {
    const response = await axiosClient.delete(`${API_URL}/rooms/${id}`);
    return response.data;
  },

  getRoomDetail: async (id: number): Promise<RoomDetail> => {
    const response = await axiosClient.get(`${API_URL}/rooms/${id}/detail`);
    return response.data;
  },

  processMaintenanceRequest: async (requestId: number, status: string, notes?: string) => {
    const response = await axiosClient.put(`${API_URL}/rooms/maintenance-requests/${requestId}`, {
      status,
      notes
    });
    return response.data;
  },

  addMaintenance: async (roomId: number, maintenanceData: any) => {
    const response = await axiosClient.post(`${API_URL}/rooms/${roomId}/maintenance`, maintenanceData);
    return response.data;
  },

  removeResident: async (roomId: number, residentId: number) => {
    const response = await axiosClient.delete(`${API_URL}/rooms/${roomId}/residents/${residentId}`);
    return response.data;
  },

  addUtility: async (roomId: number, utilityData: any) => {
    const response = await axiosClient.post(`${API_URL}/rooms/${roomId}/utilities`, utilityData);
    return response.data;
  },

  updateRoomStatus: async (id: number, status: string) => {
    const response = await axiosClient.put(`${API_URL}/rooms/${id}/status`, { status });
    return response.data;
  },

  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    const response = await axiosClient.put(`${API_URL}/invoices/${invoiceId}/status`, {
      status,
      paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined
    });
    return response.data;
  },
};

export default roomApi; 