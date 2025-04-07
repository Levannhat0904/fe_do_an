import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { publicAxios } from './axiosClient';
import axios from 'axios';
const API_URL = 'http://localhost:3000/api';
interface StudentRegistration {
  email: string;
  studentCode: string;
  fullName: string;
  birthDate: string;
  gender: 'male' | 'female';
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  faculty: string;
  major: string;
  className: string;
  avatarPath?: string;
}

interface StudentRegistrationResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
}

const studentApi = {
  createRegistration: async (data: any): Promise<StudentRegistrationResponse> => {
    const formData = new FormData();

    // Append tất cả các trường (trừ avatar) vào FormData
    Object.keys(data).forEach(key => {
      if (key !== 'avatarPath') {
        formData.append(key, data[key]);
      }
    });

    // Xử lý file upload riêng
    if (data.avatarPath?.[0]?.originFileObj) {
      formData.append('avatarPath', data.avatarPath[0].originFileObj);
    }

    const response = await publicAxios.post(`${API_URL}/student/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const useCreateStudentRegistration = () => {
  return useMutation({
    mutationFn: studentApi.createRegistration,
    onSuccess: (response) => {
      if (response.success) {
        message.success('Đăng ký thành công, vui lòng chờ admin phê duyệt');
      }
    },
    onError: (error) => {
      message.error('Đăng ký thất bại. Vui lòng thử lại');
    },
  });
};

export default studentApi;
