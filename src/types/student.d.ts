import { StudentStatusEnum } from "@/constants/enums";

export interface Student {
  id?: number;
  userId?: number;
  studentCode?: string;
  fullName?: string;
  gender?: string;
  birthDate?: string;
  role?: string;
  email?: string;
  password?: string;
  userType?: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;

  // Thông tin liên lạc
  phone?: string;
  email?: string;

  // Thông tin địa chỉ
  province?: string;
  district?: string;
  ward?: string;
  address?: string;

  // Thông tin học vụ
  faculty?: string;
  major?: string;
  className?: string;

  // Ảnh chân dung
  avatarPath?: string;
  status?: StudentStatusEnum;
}
interface StudentDetailData {
  student: Student;
  dormitory: Dormitory;
  history: HistoryItem[];
  roommates: Roommate[];
}
export interface Dormitory {
  id: number;
  studentId: number;
  dormitoryId: number;
  roomNumber: string;
  bedNumber: string;
  semester: number;
  schoolYear: number;
  checkInDate: string;
  checkOutDate: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked';
}
export interface History {
  id: number;
  studentId: number;
  dormitoryId: number;
  roomNumber: string;
  bedNumber: string;
}
export interface Roommate {
  id: number;
  studentId: number;
  dormitoryId: number;
  roomNumber: string;
  bedNumber: string;
}