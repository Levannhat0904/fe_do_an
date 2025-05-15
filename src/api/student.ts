import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import axiosClient, { publicAxios } from './axiosClient';
import axios from 'axios';
import { StudentStatusEnum } from '@/constants/enums';
import { Student, MaintenanceRequest } from '@/types/student';
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

interface StudentDetailDataResponse {
  success: boolean;
  message: string;
  data: {
    student: Student;
    dormitory: {
      id: number;
      buildingId: number;
      buildingName: string;
      roomId: number;
      roomNumber: string;
      bedNumber: string;
      semester: string;
      schoolYear: string;
      checkInDate: string;
      checkOutDate: string;
      contractId?: number;
      monthlyFee: number;
      depositAmount: number;
      status: string;
    };
    history: {
      id: number;
      date: string;
      action: string;
      description: string;
      user: string;
    }[];
    roommates: {
      id: number;
      studentCode: string;
      fullName: string;
      gender: string;
      status: string;
      avatarPath?: string;
    }[];
  };
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

interface MaintenanceRequestsResponse {
  success: boolean;
  message: string;
  data: MaintenanceRequest[];
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

  getStudentDetailById: async (id: number): Promise<StudentDetailDataResponse> => {
    try {
      console.log(`Fetching student detail for ID: ${id}`);
      const response = await axiosClient.get(`${API_URL}/student/${id}/detail`);
      console.log('Student detail response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching student detail:', error);
      throw error;
    }
  },

  getCurrentStudentDetail: async (): Promise<StudentDetailDataResponse> => {
    try {
      console.log('Fetching current student detail');
      const response = await axiosClient.get(`${API_URL}/student/current/detail`);
      console.log('Current student detail response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching current student detail:', error);
      throw error;
    }
  },

  updateStudentStatus: async (id: number, status: StudentStatusEnum): Promise<UpdateStatusResponse> => {
    const response = await axiosClient.put(`${API_URL}/student/${id}/status`, { status });
    return response.data;
  },

  updateStudentDormitory: async (id: number, dormitoryData: any): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.put(`${API_URL}/student/${id}/dormitory`, dormitoryData);
    return response.data;
  },

  updateStudentProfile: async (id: number, data: any): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosClient.put(`${API_URL}/student/${id}/profile`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRoomMaintenanceRequests: async (roomId: number): Promise<MaintenanceRequestsResponse> => {
    try {
      const response = await axiosClient.get(`${API_URL}/rooms/${roomId}/maintenance-requests`);
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      throw error;
    }
  },

  createMaintenanceRequest: async (data: any): Promise<{ success: boolean; message: string }> => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.keys(data).forEach(key => {
        if (key !== 'images') {
          formData.append(key, data[key]);
        }
      });

      // Handle image uploads
      if (data.images && data.images.length > 0) {
        data.images.forEach((file: any, index: number) => {
          if (file.originFileObj) {
            formData.append('images', file.originFileObj);
          }
        });
      }

      const response = await axiosClient.post(`${API_URL}/rooms/maintenance-requests`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      throw error;
    }
  },

  cancelMaintenanceRequest: async (requestId: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosClient.delete(`${API_URL}/rooms/maintenance-requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling maintenance request:', error);
      throw error;
    }
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

export const useGetStudentDetailById = (id: number) => {
  return useQuery({
    queryKey: ['studentDetail', id],
    queryFn: () => studentApi.getStudentDetailById(id),
    enabled: !!id,
  });
};

export const useGetCurrentStudentDetail = () => {
  return useQuery({
    queryKey: ['currentStudentDetail'],
    queryFn: () => studentApi.getCurrentStudentDetail(),
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

export const useUpdateStudentDormitory = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      studentApi.updateStudentDormitory(id, data),
    onSuccess: (response) => {
      if (response.success) {
        message.success('Cập nhật thông tin phòng ở thành công');
      }
    },
    onError: (error) => {
      message.error('Cập nhật thông tin phòng ở thất bại. Vui lòng thử lại');
    },
  });
};

export const useUpdateStudentProfile = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      studentApi.updateStudentProfile(id, data),
    onSuccess: (response) => {
      if (response.success) {
        message.success('Cập nhật thông tin cá nhân thành công');
      }
    },
    onError: (error) => {
      message.error('Cập nhật thông tin cá nhân thất bại. Vui lòng thử lại');
    },
  });
};

export const useGetRoomMaintenanceRequests = (roomId: number) => {
  return useQuery({
    queryKey: ['maintenanceRequests', roomId],
    queryFn: () => studentApi.getRoomMaintenanceRequests(roomId),
    enabled: !!roomId,
  });
};

export const useCreateMaintenanceRequest = () => {
  return useMutation({
    mutationFn: studentApi.createMaintenanceRequest,
    onSuccess: (response) => {
      if (response.success) {
        message.success('Yêu cầu bảo trì đã được gửi thành công');
      }
    },
    onError: (error) => {
      message.error('Gửi yêu cầu bảo trì thất bại. Vui lòng thử lại');
    },
  });
};

export const useCancelMaintenanceRequest = () => {
  return useMutation({
    mutationFn: (requestId: number) => studentApi.cancelMaintenanceRequest(requestId),
    onSuccess: (response) => {
      if (response.success) {
        message.success('Đã hủy yêu cầu bảo trì');
      }
    },
    onError: (error) => {
      message.error('Không thể hủy yêu cầu. Vui lòng thử lại sau');
    },
  });
};

export default studentApi;
