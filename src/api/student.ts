import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient, { publicAxios } from './axiosClient';
import axios from 'axios';
import { StudentStatusEnum } from '@/constants/enums';
import { Student } from '@/types/student';
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

interface StudentListResponse {
  success: boolean;
  message: string;
  data: Student[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

interface StudentDetailResponse {
  success: boolean;
  message: string;
  data: Student;
}

interface UpdateStatusResponse {
  success: boolean;
  message: string;
}

interface GetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
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

    const response = await publicAxios.post(`${API_URL}/student`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAllStudents: async (params: GetStudentsParams = { page: 1, limit: 10 }): Promise<StudentListResponse> => {
    const response = await axiosClient.get(`${API_URL}/student`, {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search
      }
    });
    return response.data;
  },
  activeStudent: async (studentId: string) => {
    const response = await axiosClient.patch(`${API_URL}/student/${studentId}/activate`);
    return response.data;
  },
  rejectStudent: async (studentId: string) => {
    const response = await axiosClient.patch(`${API_URL}/student/${studentId}/reject`);
    return response.data;
  },

  getStudentById: async (id: number): Promise<Student> => {
    const response = await axiosClient.get(`${API_URL}/student/${id}`);
    return response?.data?.data;
  },

  updateStudentStatus: async (id: number, status: StudentStatusEnum): Promise<UpdateStatusResponse> => {
    const response = await axiosClient.put(`${API_URL}/student/${id}/status`, { status });
    return response.data;
  },
};
export const useActiveStudent = (studentId: string) => {
  return useMutation({
    mutationFn: () => studentApi.activeStudent(studentId),
  });
};

export const useRejectStudent = (studentId: string) => {
  return useMutation({
    mutationFn: () => studentApi.rejectStudent(studentId),
  });
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

export const useGetStudents = (page: number = 1, limit: number = 10, search: string = "") => {
  return useQuery({
    queryKey: ['students', page, limit, search],
    queryFn: () => studentApi.getAllStudents({ page, limit, search }),
  });
};

export const useGetStudentById = (id: number) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentApi.getStudentById(id),
    enabled: !!id,
  });
};

export const useUpdateStudentStatus = () => {
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: StudentStatusEnum }) =>
      studentApi.updateStudentStatus(id, status),
    onSuccess: (response) => {
      if (response.success) {
        message.success('Cập nhật trạng thái thành công');
      }
    },
    onError: (error) => {
      message.error('Cập nhật trạng thái thất bại. Vui lòng thử lại');
    },
  });
};

export default studentApi;
