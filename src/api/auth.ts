import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient from './axiosClient';
import { KTX_ADMIN_ACCESS_TOKEN } from '@/constants';
import { getCookie } from 'cookies-next';
import { setAuthCookies } from '@/utils';
import { AdminProfile } from '@/types/student';
const API_URL = 'http://localhost:3000/api';

interface LoginCredentials {
  email: string;
  password: string;
}
interface User {
  id: number;
  email: string;
  userType: string;
  profile: {
    id: number;
    staffCode: string;
    fullName: string;
    role: string;
  };
}
interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}
export interface CurrentSessionResponse {
  success: boolean;
  message: string;
  data: AdminProfile;
}
interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}
interface LogoutResponse {
  success: boolean;
  message: string;
}

const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },
  getProfile: async (): Promise<CurrentSessionResponse> => {
    const response = await axiosClient.get(`${API_URL}/admin/current-session`);
    return response.data;
  },
  logout: async (): Promise<LogoutResponse> => {
    const response = await axiosClient.post(`${API_URL}/auth/logout`);
    return response.data;
  },
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await axiosClient.post(`${API_URL}/auth/refresh-token`, {
      refreshToken,
    });
    return response.data;
  },
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      message.success('Đăng nhập thành công');
      return data;
    },
    onError: (error) => {
      message.error('Đăng nhập thất bại');
    },
  });
};
export const useCurrentSession = () => {
  return useQuery({
    queryKey: ['currentSession'],
    queryFn: authApi.getProfile,
    enabled: !!getCookie(KTX_ADMIN_ACCESS_TOKEN),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
export const useRefreshToken = () => {
  console.log('useRefreshToken');
  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      console.log('datadd', data);
      if (data.success && data.data.accessToken) {
        // Cập nhật access token mới vào cookie
        setAuthCookies({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          user: {
            profile: {
              role: 'admin',
            },
          },
        });
      }
    },
    onError: (error) => {
      message.error('Phiên đăng nhập hết hạn');
      // Xử lý logout khi refresh token thất bại
      window.location.href = '/login';
    },
  });
};
export const useLogout = () => {
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: (data) => {
      if (data.success) {
        message.success('Đăng xuất thành công');
      }
    },
    onError: () => {
      message.error('Đăng xuất thất bại');
    }
  });
};

export default authApi;
