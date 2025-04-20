import axiosClient from './axiosClient';

const API_URL = 'http://localhost:3000/api';

export interface DashboardSummary {
  totalStudents: number;
  activeStudents: number;
  pendingStudents: number;
  availableRooms: number;
  totalRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  pendingRequests: number;
  monthlyRevenue: number;
}

export interface ChartData {
  month?: string;
  year?: string;
  revenue: number;
  students: number;
}

export interface OccupancyData {
  name: string;
  value: number;
}

export interface OccupancyStats {
  monthly: OccupancyData[];
  yearly: OccupancyData[];
}

const dashboardApi = {
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await axiosClient.get(`${API_URL}/dashboard/summary`);
    return response.data;
  },

  getMonthlyStats: async (year?: number): Promise<ChartData[]> => {
    const params = year ? { year } : {};
    const response = await axiosClient.get(`${API_URL}/dashboard/monthly-stats`, { params });
    return response.data;
  },

  getYearlyStats: async (): Promise<ChartData[]> => {
    const response = await axiosClient.get(`${API_URL}/dashboard/yearly-stats`);
    return response.data;
  },

  getOccupancyStats: async (): Promise<OccupancyStats> => {
    const response = await axiosClient.get(`${API_URL}/dashboard/occupancy-stats`);
    return response.data;
  }
};

export default dashboardApi;