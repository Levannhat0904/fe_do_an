// cấu hình axios
import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import { DEFAULT_PATH, KTX_ADMIN_ACCESS_TOKEN, KTX_ADMIN_REFRESH_TOKEN } from '@/constants';
import authApi from './auth';
import { setAuthCookies } from '@/utils';


const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getCookie(KTX_ADMIN_ACCESS_TOKEN)}`,
    'Accept': 'application/json',
  },
});

export const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Accept': 'application/json',
  },
});


axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie(KTX_ADMIN_REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const res = await authApi.refreshToken(refreshToken);

          if (res.success && res.data.accessToken) {
            setAuthCookies({
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
            });
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return axiosClient(originalRequest);
          } else {
            // window.location.href = '/login';
          }
        } catch (err) {
          // window.location.href = '/login';
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);


export default axiosClient;
