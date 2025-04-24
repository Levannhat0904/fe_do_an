import { StudentStatusEnum } from "@/constants/enums";
import { API_URL } from "@/constants/values";
import { Card, Table, Tag, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";

interface Dormitory {
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
}

interface Roommate {
  id: number;
  studentCode: string;
  fullName: string;
  gender: string;
  status: string;
  avatarPath?: string;
}

type Iprops = {
  dormitory: Dormitory;
  roommates: Roommate[];
};

const RoommateInfo = (props: Iprops) => {
  const { dormitory, roommates } = props;

  const roommateColumns = [
    {
      title: "Ảnh",
      dataIndex: "avatarPath",
      key: "avatarPath",
      render: (avatarPath: string) => (
        <Avatar
          src={avatarPath ? `${API_URL}${avatarPath}` : null}
          icon={!avatarPath && <UserOutlined />}
        />
      ),
    },
    {
      title: "MSSV",
      dataIndex: "studentCode",
      key: "studentCode",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => (
        <Tag color={gender === "male" ? "blue" : "pink"}>
          {gender === "male" ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        switch (status) {
          case "active":
            return <Tag color="green">Đang ở</Tag>;
          case "inactive":
            return <Tag color="red">Đã rời đi</Tag>;
          case "pending":
            return <Tag color="orange">Chờ duyệt</Tag>;
          default:
            return <Tag color="default">{status}</Tag>;
        }
      },
    },
  ];

  if (!dormitory || !roommates || roommates.length === 0) {
    return (
      <Card title="Bạn cùng phòng" className="shadow-sm">
        <div className="text-center text-gray-500 py-4">
          Không có bạn cùng phòng
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`Danh sách sinh viên phòng ${dormitory.roomNumber}`}
      className="shadow-sm"
    >
      <Table
        dataSource={roommates}
        columns={roommateColumns}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
};

export default RoommateInfo;
