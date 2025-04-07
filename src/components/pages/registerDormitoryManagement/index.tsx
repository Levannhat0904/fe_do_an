"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Drawer, message, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import RegisterForm from "./components/DormitoryRegistration/DormitoryRegistrationForm";
import { DormitoryRegistration } from "@/types/dormitoryRegistration";
import { dormitoryRegistrationService } from "@/services/dormitoryRegistration";

const RegisterDormitoryPage: React.FC = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DormitoryRegistration[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dormitoryRegistrationService.getAll();
      setData(response);
    } catch (error) {
      message.error("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      title: "Family Situation",
      dataIndex: "family_situation",
      key: "family_situation",
      ellipsis: true,
    },
    {
      title: "Scholarship",
      dataIndex: "scholarship_type",
      key: "scholarship_type",
    },
    {
      title: "Priority Category",
      dataIndex: "priority_category",
      key: "priority_category",
    },
    {
      title: "Health Status",
      dataIndex: "health_status",
      key: "health_status",
      ellipsis: true,
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

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await dormitoryRegistrationService.create(values);
      message.success("Registration submitted successfully");
      setIsDrawerVisible(false);
      fetchData();
    } catch (error) {
      message.error("Failed to submit registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Dormitory Registration</h1>
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
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: true }}
      />

      <Drawer
        title="New Dormitory Registration"
        width={720}
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <RegisterForm onSubmit={handleSubmit} />
      </Drawer>
    </div>
  );
};

export default RegisterDormitoryPage;
