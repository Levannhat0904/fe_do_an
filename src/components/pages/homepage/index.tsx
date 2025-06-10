"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Statistic, Tabs, Spin, Typography } from "antd";
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
import { getCookie } from "cookies-next";
import { UserType } from "@/constants";
import { useRouter } from "next/navigation";
import useWindowSize from "@/hooks/useWindowSize";

const { Title } = Typography;
const COLORS = ["#1677ff", "#ffd666"];

// Hàm định dạng số liệu
const formatNumber = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Hàm định dạng tháng
const formatMonth = (month: string | undefined): string => {
  if (!month) return "";
  const monthNames = [
    "T1", "T2", "T3", "T4", "T5", "T6", 
    "T7", "T8", "T9", "T10", "T11", "T12"
  ];
  const monthNumber = parseInt(month);
  return monthNames[monthNumber - 1] || month;
};

const StatisticsChart = ({
  data,
  xKey,
  loading,
}: {
  data: ChartData[];
  xKey: string;
  loading: boolean;
}) => {
  const { width } = useWindowSize();
  const isMobile = width < 576;
  
  // Xử lý dữ liệu để hiển thị phù hợp
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      ...item,
      // Định dạng tháng nếu xKey là "month"
      month: xKey === "month" && item.month ? formatMonth(item.month) : item.month,
      // Thêm định dạng số liệu nếu cần
      formattedRevenue: formatNumber(item.revenue || 0),
    }));
  }, [data, xKey]);

  // Tính toán giá trị tối đa cho domain
  const maxRevenue = useMemo(() => {
    if (!data || data.length === 0) return 10000000;
    const max = Math.max(...data.map(item => item.revenue || 0));
    // Làm tròn lên đến hàng triệu gần nhất
    return Math.ceil(max / 1000000) * 1000000;
  }, [data]);

  const maxStudents = useMemo(() => {
    if (!data || data.length === 0) return 600;
    const max = Math.max(...data.map(item => item.students || 0));
    // Làm tròn lên đến hàng trăm gần nhất
    return Math.ceil(max / 100) * 100;
  }, [data]);

  // Tính toán margin dựa trên kích thước màn hình
  const chartMargin = useMemo(() => {
    if (isMobile) {
      return { top: 10, right: 10, left: 40, bottom: 20 };
    }
    return { top: 10, right: 40, left: 60, bottom: 20 };
  }, [isMobile]);

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spin />
        </div>
      ) : processedData.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Không có dữ liệu
        </div>
      ) : (
        <AreaChart
          data={processedData}
          margin={chartMargin}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#666', fontSize: isMobile ? 10 : 12 }}
            padding={{ left: 10, right: 10 }}
            interval={isMobile ? 1 : 0}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value / 1000000}M`}
            domain={[0, maxRevenue]}
            tick={{ fill: '#666', fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 30 : 50}
            label={isMobile ? undefined : {
              value: "Doanh thu (VNĐ)",
              angle: -90,
              position: "insideLeft",
              offset: -45,
              style: { textAnchor: 'middle', fill: '#666', fontSize: 13 }
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, maxStudents]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 30 : 50}
            label={isMobile ? undefined : {
              value: "Sinh viên",
              angle: 90,
              position: "insideRight",
              offset: -30,
              style: { textAnchor: 'middle', fill: '#666', fontSize: 13 }
            }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '8px', 
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f0f0f0',
              fontSize: isMobile ? '12px' : '14px'
            }}
            formatter={(value: number, name: string) => {
              if (name === "Doanh thu")
                return [`${formatNumber(value)} VNĐ`, name];
              return [formatNumber(value), name];
            }}
            labelFormatter={(label) => {
              if (xKey === "month") {
                return typeof label === 'string' ? formatMonth(label) : `Tháng ${label}`;
              }
              return `Năm ${label}`;
            }}
            labelStyle={{ color: '#333', fontWeight: 500 }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            fill="url(#colorRevenue)"
            name="Doanh thu"
            strokeWidth={2}
            activeDot={{ r: isMobile ? 4 : 6, strokeWidth: 1, stroke: '#fff' }}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="students"
            stroke="#82ca9d"
            fill="url(#colorStudents)"
            name="Sinh viên"
            strokeWidth={2}
            activeDot={{ r: isMobile ? 4 : 6, strokeWidth: 1, stroke: '#fff' }}
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
};

const OccupancyChart = ({
  data,
  loading,
}: {
  data: OccupancyData[];
  loading: boolean;
}) => {
  const { width } = useWindowSize();
  const isMobile = width < 576;
  
  // Đảm bảo dữ liệu luôn có tổng là 100%
  const normalizedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    // Nếu tổng đã là 100, giữ nguyên
    if (total === 100) return data;
    
    // Nếu không, chuẩn hóa để tổng là 100
    return data.map(item => ({
      ...item,
      value: Math.round(((item.value || 0) / total) * 100)
    }));
  }, [data]);

  // Thêm thông tin chi tiết cho tooltip
  const enhancedData = useMemo(() => {
    return normalizedData.map(item => ({
      ...item,
      displayValue: `${item.value}%`,
    }));
  }, [normalizedData]);

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 250 : 320}>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spin />
        </div>
      ) : enhancedData.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Không có dữ liệu
        </div>
      ) : (
        <PieChart>
          <defs>
            <filter id="shadow" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodOpacity="0.2" />
            </filter>
          </defs>
          <Pie
            data={enhancedData}
            cx="50%"
            cy="45%"
            innerRadius={isMobile ? 50 : 70}
            outerRadius={isMobile ? 80 : 100}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            dataKey="value"
            filter="url(#shadow)"
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
            label={isMobile ? undefined : ({ name, value }) => `${value}%`}
            labelLine={false}
          >
            {enhancedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{ cursor: "pointer", filter: "brightness(100%)" }}
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
                      style={{ color: data.payload?.fill || '#333' }}
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
              fontSize: isMobile ? '12px' : '14px'
            }}
            formatter={(value) => (
              <span
                style={{
                  color: "#666666",
                  fontSize: isMobile ? "12px" : "14px",
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
  const { width } = useWindowSize();
  const isMobile = width < 576;
  
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

  // Xử lý dữ liệu tóm tắt để hiển thị
  const formattedSummary = useMemo(() => {
    return {
      ...summaryData,
      formattedMonthlyRevenue: formatNumber(Number(summaryData.monthlyRevenue) || 0),
      occupancyRateFormatted: `${summaryData.occupancyRate || 0}%`,
    };
  }, [summaryData]);

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
        setMonthlyData(monthly || []);
        setLoading((prev) => ({ ...prev, monthlyStats: false }));

        // Fetch yearly stats
        const yearly = await dashboardApi.getYearlyStats();
        setYearlyData(yearly || []);
        setLoading((prev) => ({ ...prev, yearlyStats: false }));

        // Fetch occupancy stats
        const occupancy = await dashboardApi.getOccupancyStats();
        setOccupancyData(occupancy || {
          monthly: [
            { name: "Đã sử dụng", value: 0 },
            { name: "Còn trống", value: 0 },
          ],
          yearly: [
            { name: "Đã sử dụng", value: 0 },
            { name: "Còn trống", value: 0 },
          ],
        });
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

  // Sử dụng state để tránh hydration error
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="p-3 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Tổng Quan Ký Túc Xá</h2>
      <div className="flex justify-center items-center h-[300px]">
        <Spin size="large" />
      </div>
    </div>;
  }

  return (
    <div className="p-3 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Tổng Quan Ký Túc Xá</h2>

      <Row gutter={[12, 12]} className="mb-3 sm:mb-0">
        <Col xs={12} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow" bodyStyle={isMobile ? { padding: '12px' } : {}}>
            {loading.summary ? (
              <div className="text-center py-2 sm:py-4">
                <Spin />
              </div>
            ) : (
              <Statistic
                title={<span style={{ fontSize: isMobile ? '14px' : '16px' }}>Tổng số sinh viên</span>}
                value={summaryData.totalStudents}
                prefix={<UserOutlined className="text-blue-500" />}
                className="text-center"
                valueStyle={{ fontSize: isMobile ? '18px' : '24px' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow" bodyStyle={isMobile ? { padding: '12px' } : {}}>
            {loading.summary ? (
              <div className="text-center py-2 sm:py-4">
                <Spin />
              </div>
            ) : (
              <Statistic
                title={<span style={{ fontSize: isMobile ? '14px' : '16px' }}>Phòng trống</span>}
                value={summaryData.availableRooms}
                prefix={<HomeOutlined className="text-green-500" />}
                className="text-center"
                suffix={`/${summaryData.totalRooms}`}
                valueStyle={{ fontSize: isMobile ? '18px' : '24px' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow" bodyStyle={isMobile ? { padding: '12px' } : {}}>
            {loading.summary ? (
              <div className="text-center py-2 sm:py-4">
                <Spin />
              </div>
            ) : (
              <Statistic
                title={<span style={{ fontSize: isMobile ? '14px' : '16px' }}>Doanh thu tháng</span>}
                value={formattedSummary.formattedMonthlyRevenue}
                prefix={<DollarOutlined className="text-yellow-500" />}
                suffix="VNĐ"
                className="text-center"
                valueStyle={{ fontSize: isMobile ? '18px' : '24px' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow" bodyStyle={isMobile ? { padding: '12px' } : {}}>
            {loading.summary ? (
              <div className="text-center py-2 sm:py-4">
                <Spin />
              </div>
            ) : (
              <Statistic
                title={<span style={{ fontSize: isMobile ? '14px' : '16px' }}>Yêu cầu chờ xử lý</span>}
                value={summaryData.pendingRequests}
                prefix={<AlertOutlined className="text-red-500" />}
                className="text-center"
                valueStyle={{ fontSize: isMobile ? '18px' : '24px' }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[12, 12]} className="mt-3 sm:mt-6">
        <Col xs={24} lg={16}>
          <Card className="h-auto" bodyStyle={isMobile ? { padding: '12px' } : {}}>
            <Tabs
              defaultActiveKey="month"
              items={statisticsItems}
              className="h-full"
              size={isMobile ? "small" : "middle"}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="h-auto" bodyStyle={isMobile ? { padding: '12px' } : {}}>
            <Tabs
              defaultActiveKey="month"
              items={occupancyItems}
              className="h-full"
              size={isMobile ? "small" : "middle"}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Homepage;
