import React from "react";
import { Typography, Space, Divider } from "antd";
import Image from "next/image";
import { LOGO_URL } from "@/constants/common";

const { Title, Text, Paragraph } = Typography;

interface ContractPreviewProps {
  contractData: {
    contractNumber: string;
    studentName: string;
    studentId: string;
    roomNumber: string;
    buildingName: string;
    startDate: string;
    endDate: string;
    depositAmount: number;
    monthlyFee: number;
    studentCode: string;
  };
}

const ContractPreview: React.FC<ContractPreviewProps> = ({ contractData }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount: number) => {
    return Number(amount)?.toLocaleString("vi-VN");
  };

  const today = new Date().toLocaleDateString("vi-VN");

  return (
    <div className="p-8 bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <Image
            src={LOGO_URL}
            alt="Logo KTX"
            width={80}
            height={80}
            className="object-contain"
          />
          <div>
            <Title level={4} className="!mb-0">
              KÝ TÚC XÁ SINH VIÊN
            </Title>
            <Text className="text-gray-500">
              Đại Học Công Nghệ Giao Thông Vận Tải
            </Text>
            <br />
            <Text className="text-gray-500">
              Số 54, Triều Khúc, Thanh Xuân, Thành phố Hà Nội
            </Text>
          </div>
        </div>
        <div className="text-right">
          <Title level={5} className="!mb-0">
            HỢP ĐỒNG THUÊ PHÒNG KTX
          </Title>
          <Text className="text-gray-500">
            Số: {contractData.contractNumber}
          </Text>
        </div>
      </div>

      <Divider />

      {/* Contract Title */}
      <div className="text-center mb-8">
        <Title level={3}>HỢP ĐỒNG THUÊ PHÒNG KÝ TÚC XÁ</Title>
        <Text className="text-gray-500">Năm học 2023 - 2024</Text>
      </div>

      {/* Contract Content */}
      <Paragraph>
        Hôm nay, ngày {today}, tại Ký túc xá Đại học Công Nghệ Giao Thông Vận
        Tải, chúng tôi gồm:
      </Paragraph>

      {/* Party A */}
      <div className="mb-6">
        <Title level={5}>BÊN A: ĐẠI DIỆN KÝ TÚC XÁ (Bên cho thuê)</Title>
        <div className="pl-8">
          <Text>Họ và tên: Nguyễn Văn A</Text>
          <br />
          <Text>Chức vụ: Giám đốc Trung tâm Phục vụ Sinh viên</Text>
          <br />
          <Text>Điện thoại: 0292 123 456</Text>
        </div>
      </div>

      {/* Party B */}
      <div className="mb-6">
        <Title level={5}>BÊN B: NGƯỜI THUÊ</Title>
        <div className="pl-8">
          <Text>Họ và tên: {contractData.studentName}</Text>
          <br />
          <Text>MSSV: {contractData.studentCode}</Text>
          <br />
          <Text>
            Phòng: {contractData.roomNumber} - {contractData.buildingName}
          </Text>
        </div>
      </div>

      {/* Contract Details */}
      <div className="mb-6">
        <Title level={5}>NỘI DUNG HỢP ĐỒNG</Title>
        <div className="pl-8">
          <Text>1. Thời hạn thuê phòng:</Text>
          <br />
          <Text className="pl-4">
            - Từ ngày: {contractData.startDate}
          </Text>
          <br />
          <Text className="pl-4">
            - Đến ngày: {formatDate(contractData.endDate)}
          </Text>
          <br />
          <Text>2. Giá thuê và phí dịch vụ:</Text>
          <br />
          <Text className="pl-4">
            - Tiền đặt cọc: {formatCurrency(Number(contractData.depositAmount))}{" "}
            VNĐ
          </Text>
          <br />
          <Text className="pl-4">
            - Phí thuê hàng tháng:{" "}
            {formatCurrency(Number(contractData.monthlyFee))} VNĐ
          </Text>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6">
        <Title level={5}>ĐIỀU KHOẢN CHUNG</Title>
        <div className="pl-8">
          <Text>1. Bên B cam kết tuân thủ đầy đủ nội quy KTX.</Text>
          <br />
          <Text>2. Đóng phí đúng hạn trước ngày 05 hàng tháng.</Text>
          <br />
          <Text>3. Giữ gìn tài sản và báo hỏng kịp thời.</Text>
          <br />
          <Text>4. Không được tự ý chuyển nhượng hoặc cho thuê lại.</Text>
        </div>
      </div>

      {/* Signatures */}
      <div className="flex justify-between mt-12">
        <div className="text-center">
          <Title level={5}>ĐẠI DIỆN BÊN A</Title>
          <Text className="text-gray-500">(Ký và ghi rõ họ tên)</Text>
        </div>
        <div className="text-center">
          <Title level={5}>NGƯỜI THUÊ (BÊN B)</Title>
          <Text className="text-gray-500">(Ký và ghi rõ họ tên)</Text>
        </div>
      </div>
    </div>
  );
};

export default ContractPreview; 