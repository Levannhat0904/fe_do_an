"use client";
import React, { useState } from "react";
import { Card, Row, Col, Statistic, Tabs } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  DollarOutlined,
  AlertOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Add interfaces for the data types
interface ChartData {
  month?: string;
  year?: string;
  revenue: number;
  students: number;
}

interface OccupancyData {
  name: string;
  value: number;
}

// Dữ liệu mẫu cho biểu đồ đường
const monthlyData = [
  { month: "1", revenue: 180000000, students: 480 },
  { month: "2", revenue: 200000000, students: 495 },
  { month: "3", revenue: 220000000, students: 505 },
  { month: "4", revenue: 240000000, students: 510 },
  { month: "5", revenue: 250000000, students: 520 },
  { month: "6", revenue: 230000000, students: 515 },
];

// Thêm dữ liệu mẫu cho thống kê theo năm
const yearlyData = [
  { year: "2019", revenue: 2100000000, students: 450 },
  { year: "2020", revenue: 2300000000, students: 470 },
  { year: "2021", revenue: 2500000000, students: 490 },
  { year: "2022", revenue: 2800000000, students: 510 },
  { year: "2023", revenue: 3000000000, students: 520 },
];

// Dữ liệu mẫu cho biểu đồ tròn
// Dữ liệu tỷ lệ lấp đầy theo tháng
const monthlyOccupancyData = [
  { name: "Đã sử dụng", value: 85 },
  { name: "Còn trống", value: 15 },
];

// Dữ liệu tỷ lệ lấp đầy theo năm
const yearlyOccupancyData = [
  { name: "Đã sử dụng", value: 92 },
  { name: "Còn trống", value: 8 },
];

const COLORS = ["#1677ff", "#ffd666"];

// Dữ liệu mẫu
const dashboardData = {
  totalStudents: 520,
  availableRooms: 45,
  monthlyRevenue: 250000000,
  pendingRequests: 12,
  occupancyRate: 85,
};

const StatisticsChart = ({
  data,
  xKey,
}: {
  data: ChartData[];
  xKey: string;
}) => (
  <ResponsiveContainer width="100%" height={320}>
    <AreaChart
      data={data}
      margin={{ top: 10, right: 40, left: 60, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
      <XAxis dataKey={xKey} axisLine={false} tickLine={false} />
      <YAxis
        yAxisId="left"
        axisLine={false}
        tickLine={false}
        tickFormatter={(value) => `${value / 1000000}M`}
        domain={[0, "dataMax + 1000000000"]}
        label={{
          value: "Doanh thu (VNĐ)",
          angle: -90,
          position: "insideLeft",
          offset: -45,
        }}
      />
      <YAxis
        yAxisId="right"
        orientation="right"
        domain={[0, 600]}
        axisLine={false}
        tickLine={false}
        label={{
          value: "Sinh viên",
          angle: 90,
          position: "insideRight",
          offset: -30,
        }}
      />
      <Tooltip
        formatter={(value: number, name: string) => {
          if (name === "Doanh thu")
            return [`${(value / 1000000).toFixed(0)}M VNĐ`, name];
          return [value, name];
        }}
      />
      <Area
        yAxisId="left"
        type="monotone"
        dataKey="revenue"
        stroke="#8884d8"
        fill="#8884d8"
        name="Doanh thu"
        fillOpacity={0.2}
        strokeWidth={2}
      />
      <Area
        yAxisId="right"
        type="monotone"
        dataKey="students"
        stroke="#82ca9d"
        fill="#82ca9d"
        name="Sinh viên"
        fillOpacity={0.2}
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
);

const OccupancyChart = ({ data }: { data: OccupancyData[] }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={70}
          outerRadius={100}
          startAngle={90}
          endAngle={-270}
          paddingAngle={0}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              style={{ cursor: "pointer" }}
            />
          ))}
        </Pie>

        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0];
              return (
                <div className="bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-md">
                  <p className="text-base" style={{ color: data.payload.fill }}>
                    <span className="font-medium">{data.name}</span>
                  </p>
                  <p className="text-sm mt-1">
                    Tỷ lệ: <span className="font-medium">{data.value}%</span>
                  </p>
                </div>
              );
            }
            return null;
          }}
          wrapperStyle={{ outline: "none" }}
        />

        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          wrapperStyle={{
            bottom: 10,
          }}
          formatter={(value) => (
            <span
              style={{
                color: "#666666",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

const Homepage: React.FC = () => {
  const statisticsItems = [
    {
      key: "month",
      label: "Theo tháng",
      children: <StatisticsChart data={monthlyData} xKey="month" />,
    },
    {
      key: "year",
      label: "Theo năm",
      children: <StatisticsChart data={yearlyData} xKey="year" />,
    },
  ];

  const occupancyItems = [
    {
      key: "month",
      label: "Theo tháng",
      children: <OccupancyChart data={monthlyOccupancyData} />,
    },
    {
      key: "year",
      label: "Theo năm",
      children: <OccupancyChart data={yearlyOccupancyData} />,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tổng Quan Ký Túc Xá</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Tổng số sinh viên"
              value={dashboardData.totalStudents}
              prefix={<UserOutlined className="text-blue-500" />}
              className="text-center"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Phòng trống"
              value={dashboardData.availableRooms}
              prefix={<HomeOutlined className="text-green-500" />}
              className="text-center"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Doanh thu tháng"
              value={dashboardData.monthlyRevenue}
              prefix={<DollarOutlined className="text-yellow-500" />}
              suffix="VNĐ"
              className="text-center"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Yêu cầu chờ xử lý"
              value={dashboardData.pendingRequests}
              prefix={<AlertOutlined className="text-red-500" />}
              className="text-center"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={16}>
          <Card className="h-[400px]">
            <Tabs
              defaultActiveKey="month"
              items={statisticsItems}
              className="h-full"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="h-[400px]">
            <Tabs
              defaultActiveKey="month"
              items={occupancyItems}
              className="h-full"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Homepage;
