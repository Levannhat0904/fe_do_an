import { DormitoryRegistration } from '@/types/dormitoryRegistration';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const dormitoryRegistrationService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/dormitory-registrations`);
    return response.data;
  },

  create: async (data: Partial<DormitoryRegistration>) => {
    const response = await axios.post(`${API_URL}/dormitory-registrations`, data);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get(`${API_URL}/dormitory-registrations/${id}`);
    return response.data;
  },

  update: async (id: number, data: Partial<DormitoryRegistration>) => {
    const response = await axios.put(`${API_URL}/dormitory-registrations/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`${API_URL}/dormitory-registrations/${id}`);
    return response.data;
  },
}; 