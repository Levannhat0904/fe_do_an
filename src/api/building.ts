import axiosClient from './axiosClient';

const API_URL = '/api/buildings';

export interface Building {
  id: number;
  name: string;
  totalFloors: number;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  totalRooms?: number;
  availableRooms?: number;
}

export interface BuildingResponse {
  data: Building[];
  message: string;
}

export interface BuildingDetailResponse {
  data: Building & {
    rooms: any[];
  };
  message: string;
}

const buildingApi = {
  // Get all buildings
  getAllBuildings: async (): Promise<BuildingResponse> => {
    const response = await axiosClient.get(API_URL);
    return response.data;
  },

  // Get a single building by ID
  getBuildingById: async (id: number): Promise<BuildingDetailResponse> => {
    const response = await axiosClient.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create a new building
  createBuilding: async (buildingData: Omit<Building, 'id' | 'createdAt'>) => {
    const response = await axiosClient.post(API_URL, buildingData);
    return response.data;
  },

  // Update an existing building
  updateBuilding: async (id: number, buildingData: Partial<Building>) => {
    const response = await axiosClient.put(`${API_URL}/${id}`, buildingData);
    return response.data;
  },

  // Delete a building
  deleteBuilding: async (id: number) => {
    const response = await axiosClient.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default buildingApi; 