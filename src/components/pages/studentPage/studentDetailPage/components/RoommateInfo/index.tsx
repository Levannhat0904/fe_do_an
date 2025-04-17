import { StudentStatusEnum } from "@/constants/enums";
import { Card, Table, Tag } from "antd";
import React from "react";
type Iprops = {
  dormitory: any;
  roommates: any;
};
const roommateColumns = [
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
    render: (status: StudentStatusEnum) => (
      <Tag color={status === "pending" ? "orange" : "green"}>
        {status === "pending" ? "Chờ duyệt" : "Đã duyệt"}
      </Tag>
    ),
  },
];
const RoommateInfo = (props: Iprops) => {
  const { dormitory, roommates } = props;
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
