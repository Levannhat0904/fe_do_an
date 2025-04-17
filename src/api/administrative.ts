import { useQuery } from '@tanstack/react-query';
import { publicAxios } from './axiosClient';

const API_URL = 'http://localhost:3000/api';


export interface District {
  name: string;
  code: string;
}

export interface Ward {
  id: number;
  name: string;
  code: string;
  districtId: number;
}

export interface Province {
  name: string;
  code: number;
}

const administrativeApi = {
  getProvinces: async () => {
    const response = await publicAxios.get(`${API_URL}/administrative/provinces`);
    return response;
  },

  getDistricts: async (provinceId: number) => {
    const response = await publicAxios.get(`${API_URL}/administrative/provinces/${provinceId}/districts`);
    return response;
  },

  getWards: async (provinceId: number, districtId: number) => {
    const response = await publicAxios.get(
      `${API_URL}/administrative/provinces/${provinceId}/districts/${districtId}/wards`
    );
    return response;
  },
};

export const useGetProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const response = await administrativeApi.getProvinces();
      return response.data;
    },
    gcTime: 1000 * 60 * 60 * 24,
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useGetDistricts = (provinceId: number) => {
  return useQuery({
    queryKey: ['districts', provinceId],
    queryFn: () => administrativeApi.getDistricts(provinceId),
    enabled: !!provinceId,
  });
};

export const useGetWards = (provinceId: number, districtId: number) => {
  return useQuery({
    queryKey: ['wards', provinceId, districtId],
    queryFn: () => administrativeApi.getWards(provinceId, districtId),
    enabled: !!provinceId && !!districtId,
  });
};

export default administrativeApi; 