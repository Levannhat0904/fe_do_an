"use client";
import React, { useState } from "react";
import { Table, Button, Drawer, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import DormitoryRegistrationForm from "./DormitoryRegistrationForm";
import { DormitoryRegistration } from "@/types/dormitoryRegistration";

const DormitoryRegistrationTable: React.FC = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const columns: ColumnsType<DormitoryRegistration> = [
    {
      title: "Registration Number",
      dataIndex: "registration_number",
      key: "registration_number",
    },
    {
      title: "Academic Year",
      dataIndex: "academic_year",
      key: "academic_year",
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
    },
    {
      title: "Room Type",
      dataIndex: "desired_room_type",
      key: "desired_room_type",
    },
    {
      title: "Registration Date",
      dataIndex: "registration_date",
      key: "registration_date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap = {
          pending: "gold",
          approved: "green",
          rejected: "red",
          waitlisted: "blue",
        };
        return (
          <Tag color={colorMap[status as keyof typeof colorMap]}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsDrawerVisible(true)}
        >
          New Registration
        </Button>
      </div>

      <Table<DormitoryRegistration>
        columns={columns}
        // Add your data source here
        // dataSource={dormitoryRegistrations}
        rowKey="id"
      />

      <Drawer
        title="New Dormitory Registration"
        width={720}
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <DormitoryRegistrationForm
          onSubmit={(values) => {
            console.log(values);
            setIsDrawerVisible(false);
          }}
        />
      </Drawer>
    </div>
  );
};

export default DormitoryRegistrationTable;
