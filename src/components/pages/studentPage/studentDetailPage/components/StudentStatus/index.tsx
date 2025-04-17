import { StudentStatusEnum } from "@/constants/enums";
import { Badge } from "antd";

type StudentStatusProps = {
  status?: StudentStatusEnum;
};
const StudentStatus = ({ status }: StudentStatusProps) => {
  switch (status) {
    case "pending":
      return <Badge status="warning" text="Chờ duyệt" />;
    case "active":
      return <Badge status="success" text="Đã duyệt" />;
    case "inactive":
      return <Badge status="error" text="Từ chối" />;
    default:
      return <Badge status="default" text="Không xác định" />;
  }
};

export default StudentStatus;
