import React from "react";
import { Card, Row, Col, Avatar, Typography, Badge } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Student } from "@/types/student";
import Image from "next/image";
import { LOGO_URL } from "@/constants";
import { KButton } from "@/components/atoms";

const { Title, Text } = Typography;

interface StudentCardProps {
  student: Student | null;
  onClick: () => void;
}

/**
 * Card hiển thị thông tin sinh viên
 * Sử dụng nền màu cam (gradient) theo yêu cầu
 */
const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  return (
    <div
      className="flex items-center justify-between md:justify-between gap-5"
      style={{
        marginBottom: "20px",
        boxShadow: "8px 0 16px #fff4de, -8px 0 16px #fff4de",
        background:
          "linear-gradient(90deg, #fff 0%, #fff4de 25%, #fff4de 75%, #fff 100%)",
      }}
    >
      <Image
        src="/images/triple_arrows.png"
        alt="triple_arrows_left"
        className="transform scale-x-[-1]"
        width={100}
        height={100}
      />
      <div
        className="flex flex-col md:flex-row items-center justify-start md:justify-start cursor-pointer md:gap-5"
        onClick={onClick}
      >
        <div>
          <Image
            src={
              student?.avatarPath
                ? "http://localhost:3000" + student?.avatarPath
                : LOGO_URL
            }
            style={{ border: "4px solid white" }}
            width={120}
            height={120}
            alt="avatar"
            className="rounded-full w-20 h-20 md:w-32 md:h-32 object-cover aspect-square"
          />
        </div>
        <div>
          <div>
            <div className="flex items-center justify-center align-middle">
              <Title
                level={2}
                className="md:s5-medium text-sm whitespace-nowrap"
              >
                {student?.fullName || "Sinh viên"}
              </Title>
              <EditOutlined className="ml-2 text-lg font-bold !text-black mb-2" />
            </div>
            <Text className="s5-regular text-dark_1 text-sm">
              MSSV: {student?.studentCode} | {student?.faculty} -{" "}
              {student?.major}
            </Text>
          </div>
          <div>
            <Text className="s5-regular mr-2 text-dark_1 text-sm">
              Trạng thái:{" "}
              <span
                className={`${
                  student?.status === "active"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {student?.status === "active"
                  ? "Đang hoạt động"
                  : "Chờ xác nhận"}
              </span>
            </Text>
          </div>
          <div>
            <Text className="s5-regular text-dark-2 text-sm">
              Lớp: {student?.className}
            </Text>
          </div>
        </div>
      </div>
      <Image
        src="/images/triple_arrows.png"
        alt="triple_arrows_right"
        className="transform scale-x-100"
        width={100}
        height={100}
      />
    </div>
  );
};

export default StudentCard;
