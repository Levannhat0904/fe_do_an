import { StudentDetailData } from '@/types/student';
import { useState, useEffect } from 'react';

export const useStudentDetail = (id: number) => {
  const [data, setData] = useState<StudentDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - thay thế bằng API call thực tế
    const mockData = {
      student: {
        id: id,
        studentCode: "SV" + id.toString().padStart(6, "0"),
        fullName: "Nguyễn Văn A",
        gender: "male",
        birthDate: "2002-05-15",
        phone: "0987654321",
        email: "nguyenvana@example.com",
        faculty: "technology",
        major: "software-engineering",
        className: "CNTT2022",
        status: "approved",
        avatarPath: "/avatars/student.jpg",
        address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
        idCard: "079202012345",
        emergencyContact: "Nguyễn Văn B - 0912345678",
      },
      dormitory: {
        applicationId: "DK" + id.toString().padStart(6, "0"),
        registrationDate: "2024-08-15",
        approvalStatus: "pending", // pending, approved, rejected
        approvedBy: null,
        approvalDate: null,
        rejectionReason: null,
        buildingName: "Tòa nhà A",
        roomNumber: "A304",
        bedNumber: "01",
        semester: "1",
        schoolYear: "2024-2025",
        checkInDate: null,
        checkOutDate: null,
        monthlyFee: 500000,
        depositAmount: 1000000,
        paymentStatus: "unpaid", // unpaid, partial, paid
      },
      history: [
        {
          date: "2024-08-15T09:30:00",
          action: "register",
          description: "Đăng ký ở ký túc xá",
          user: "Nguyễn Văn A",
        },
        {
          date: "2024-08-16T14:22:00",
          action: "document_submit",
          description: "Nộp giấy tờ xác nhận",
          user: "Nguyễn Văn A",
        },
        {
          date: "2024-08-18T10:15:00",
          action: "payment",
          description: "Đã thanh toán tiền đặt cọc 1,000,000đ",
          user: "Nguyễn Văn A",
        },
      ],
      roommates: [
        {
          id: 1002,
          studentCode: "SV000002",
          fullName: "Trần Văn B",
          gender: "male",
          status: "approved",
        },
        {
          id: 1003,
          studentCode: "SV000003",
          fullName: "Lê Thị C",
          gender: "female",
          status: "approved",
        },
        {
          id: 1004,
          studentCode: "SV000004",
          fullName: "Phạm Văn D",
          gender: "male",
          status: "pending",
        },
      ],
    };

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [id]);

  return { data, isLoading, error };
};
