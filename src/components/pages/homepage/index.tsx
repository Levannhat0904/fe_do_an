"use client";
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Tabs, Spin } from "antd";
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
import dashboardApi, {
  ChartData,
  OccupancyData,
  DashboardSummary,
  OccupancyStats,
} from "@/api/dashboard";

const COLORS = ["#1677ff", "#ffd666"];

const StatisticsChart = ({
  data,
  xKey,
  loading,
}: {
  data: ChartData[];
  xKey: string;
  loading: boolean;
}) => (
  <ResponsiveContainer width="100%" height={400}>
    {loading ? (
      <div className="flex items-center justify-center h-full">
        <Spin />
      </div>
    ) : (
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
          domain={[0, 10000000]}
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
              return [`${(value / 1000000).toFixed(2)}M VNĐ`, name];
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
          fillOpacity={0.4}
          strokeWidth={3}
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
    )}
  </ResponsiveContainer>
);

const OccupancyChart = ({
  data,
  loading,
}: {
  data: OccupancyData[];
  loading: boolean;
}) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spin />
        </div>
      ) : (
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
                    <p
                      className="text-base"
                      style={{ color: data.payload.fill }}
                    >
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
      )}
    </ResponsiveContainer>
  );
};

const Homepage: React.FC = () => {
  const [loading, setLoading] = useState({
    summary: true,
    monthlyStats: true,
    yearlyStats: true,
    occupancyStats: true,
  });

  const [summaryData, setSummaryData] = useState<DashboardSummary>({
    totalStudents: 0,
    activeStudents: 0,
    pendingStudents: 0,
    availableRooms: 0,
    totalRooms: 0,
    maintenanceRooms: 0,
    occupancyRate: 0,
    pendingRequests: 0,
    monthlyRevenue: 0,
  });

  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [yearlyData, setYearlyData] = useState<ChartData[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyStats>({
    monthly: [
      { name: "Đã sử dụng", value: 0 },
      { name: "Còn trống", value: 0 },
    ],
    yearly: [
      { name: "Đã sử dụng", value: 0 },
      { name: "Còn trống", value: 0 },
    ],
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch summary
        const summary = await dashboardApi.getDashboardSummary();
        setSummaryData(summary);
        setLoading((prev) => ({ ...prev, summary: false }));

        // Fetch monthly stats
        const monthly = await dashboardApi.getMonthlyStats();
        setMonthlyData(monthly);
        setLoading((prev) => ({ ...prev, monthlyStats: false }));

        // Fetch yearly stats
        const yearly = await dashboardApi.getYearlyStats();
        setYearlyData(yearly);
        setLoading((prev) => ({ ...prev, yearlyStats: false }));

        // Fetch occupancy stats
        const occupancy = await dashboardApi.getOccupancyStats();
        setOccupancyData(occupancy);
        setLoading((prev) => ({ ...prev, occupancyStats: false }));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading({
          summary: false,
          monthlyStats: false,
          yearlyStats: false,
          occupancyStats: false,
        });
      }
    };

    fetchDashboardData();
  }, []);

  const statisticsItems = [
    {
      key: "month",
      label: "Theo tháng",
      children: (
        <StatisticsChart
          data={monthlyData}
          xKey="month"
          loading={loading.monthlyStats}
        />
      ),
    },
    {
      key: "year",
      label: "Theo năm",
      children: (
        <StatisticsChart
          data={yearlyData}
          xKey="year"
          loading={loading.yearlyStats}
        />
      ),
    },
  ];

  const occupancyItems = [
    {
      key: "month",
      label: "Theo tháng",
      children: (
        <OccupancyChart
          data={occupancyData.monthly}
          loading={loading.occupancyStats}
        />
      ),
    },
    {
      key: "year",
      label: "Theo năm",
      children: (
        <OccupancyChart
          data={occupancyData.yearly}
          loading={loading.occupancyStats}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tổng Quan Ký Túc Xá</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            {loading.summary ? (
              <div className="text-center py-4">
                <Spin />
              </div>
            ) : (
              <Statistic
                title="Tổng số sinh viên"
                value={summaryData.totalStudents}
                prefix={<UserOutlined className="text-blue-500" />}
                className="text-center"
              />
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            {loading.summary ? (
              <div className="text-center py-4">
                <Spin />
              </div>
            ) : (
              <Statistic
                title="Phòng trống"
                value={summaryData.availableRooms}
                prefix={<HomeOutlined className="text-green-500" />}
                className="text-center"
              />
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            {loading.summary ? (
              <div className="text-center py-4">
                <Spin />
              </div>
            ) : (
              <Statistic
                title="Doanh thu tháng"
                value={summaryData.monthlyRevenue}
                prefix={<DollarOutlined className="text-yellow-500" />}
                suffix="VNĐ"
                className="text-center"
              />
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            {loading.summary ? (
              <div className="text-center py-4">
                <Spin />
              </div>
            ) : (
              <Statistic
                title="Yêu cầu chờ xử lý"
                value={summaryData.pendingRequests}
                prefix={<AlertOutlined className="text-red-500" />}
                className="text-center"
              />
            )}
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
