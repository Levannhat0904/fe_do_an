import { StudentStatusEnum } from "@/constants/enums";
import { Student } from "@/types/student";
import { Button } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Space } from "antd";

interface StudentActionProps {
  student: Student;
  handleEdit: () => void;
  handlePrint: () => void;
  handleBack: () => void;
  loading: boolean;
}
const StudentAction = ({
  student,
  handleEdit,
  handlePrint,
  handleBack,
  loading,
}: StudentActionProps) => {
  // Các nút hành động dựa trên trạng thái của sinh viên
  return (
    <Space wrap size="middle" align="end">
      <Button
        icon={<EditOutlined />}
        onClick={handleEdit}
        disabled={student?.status === StudentStatusEnum.blocked}
        loading={loading}
      >
        Sửa
      </Button>

      <Button
        icon={<PrinterOutlined />}
        onClick={handlePrint}
        loading={loading}
      >
        In hồ sơ
      </Button>

      <Button icon={<RollbackOutlined />} onClick={handleBack}>
        Quay lại
      </Button>
    </Space>
  );
};

export default StudentAction;
