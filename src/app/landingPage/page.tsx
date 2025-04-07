"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Button,
  Carousel,
  Card,
  Row,
  Col,
  Statistic,
  Layout,
  Menu,
  Form,
  Input,
  Divider,
  Badge,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  RightOutlined,
  CheckCircleOutlined,
  CoffeeOutlined,
  WifiOutlined,
  EnvironmentOutlined,
  QuestionCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  BookOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const { Header, Content, Footer } = Layout;
const { Meta } = Card;

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout className="min-h-screen">
      {/* Header với gradient màu và slide-in animation */}
      <Header className="flex fixed top-0 left-0 right-0 items-center justify-between !p-5 md:!px-10 bg-gradient-to-r from-orange-600 to-yellow-500 shadow-md z-10">
        {/* Logo - hiển thị trên cả mobile và desktop */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="text-xl md:text-2xl font-bold text-white">
            KTX SINH VIÊN
          </div>
        </motion.div>

        {/* Menu - chỉ hiển thị trên desktop */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex gap-8 items-center"
        >
          <div
            onClick={() => scrollToSection("home")}
            className="bg-transparent text-white hover:bg-transparent border-yellow-500 cursor-pointer"
          >
            Trang chủ
          </div>
          <div
            onClick={() => scrollToSection("about")}
            className="bg-transparent text-white hover:bg-transparent border-yellow-500 cursor-pointer"
          >
            Giới thiệu
          </div>
          <div
            onClick={() => scrollToSection("rooms")}
            className="bg-transparent text-white hover:bg-transparent border-yellow-500 cursor-pointer"
          >
            Phòng ở
          </div>
          <div
            onClick={() => scrollToSection("facilities")}
            className="bg-transparent text-white hover:bg-transparent border-yellow-500 cursor-pointer"
          >
            Tiện ích
          </div>
          <div
            onClick={() => scrollToSection("contact")}
            className="bg-transparent text-white hover:bg-transparent border-yellow-500 cursor-pointer"
          >
            Liên hệ
          </div>
        </motion.div>

        {/* Nút đăng nhập - hiển thị trên cả mobile và desktop */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="text"
            size="large"
            className="!bg-transparent !text-white hover:bg-transparent border-orange-500"
          >
            <span className="hidden md:inline">Đăng nhập</span>
            <UserOutlined className="md:hidden" />
          </Button>
        </motion.div>
      </Header>

      {/* Hero Section với fade-in animation */}
      <div id="home" className="relative mt-16 md:mt-16">
        <Carousel autoplay className="h-48 md:h-96">
          <div className="h-48 md:h-96 bg-blue-900 flex items-center justify-center text-white">
            <Image
              src="/images/image.png"
              alt="Ký túc xá"
              className="w-full h-full object-cover"
              width={1920}
              height={500}
            />
          </div>
          <div className="h-48 md:h-96 bg-blue-800 flex items-center justify-center text-white">
            <Image
              src="/images/image1.png"
              alt="Sinh viên trong ký túc xá"
              className="w-full h-full object-cover"
              width={1920}
              height={500}
            />
          </div>
        </Carousel>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center flex-col bg-black bg-opacity-50 text-white p-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            KÝ TÚC XÁ SINH VIÊN
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-center">
            Môi trường sống lý tưởng cho sinh viên
          </p>
          <div className="mt-8 flex gap-4">
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 border-0"
            >
              Đăng ký ngay
            </Button>
            <Button
              size="large"
              className="bg-white text-orange-600 hover:text-orange-700 hover:bg-gray-100"
            >
              Tìm hiểu thêm
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Features với stagger animation */}
      <Content className="max-w-7xl mx-auto py-16 px-4">
        <div id="about">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-orange-600">
              Tại sao chọn Ký túc xá của chúng tôi?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp một môi trường sống an toàn, tiện nghi với đầy
              đủ tiện ích và dịch vụ hỗ trợ cho sinh viên.
            </p>
          </motion.div>

          <Row gutter={[32, 32]} className="mb-16">
            {[0, 1, 2].map((index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-t-4 border-orange-500">
                    <div className="text-center mb-4">
                      <div className="inline-block p-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white mb-4">
                        <LockOutlined style={{ fontSize: 24 }} />
                      </div>
                      <h3 className="text-xl font-bold text-orange-600">
                        An ninh 24/7
                      </h3>
                      <p className="text-gray-600">
                        Hệ thống an ninh hiện đại với bảo vệ trực 24/7 và camera
                        giám sát toàn khu vực.
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Số liệu thống kê với gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white rounded-lg p-8 mb-16 shadow-lg"
          >
            <Row gutter={[32, 32]}>
              {[0, 1, 2, 3].map((index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <Statistic
                    title={<span className="text-white">Sinh viên</span>}
                    value={1000}
                    className="text-white"
                    valueStyle={{ color: "white", fontSize: "2rem" }}
                  />
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>

        {/* Các loại phòng với ribbon và màu sắc nổi bật */}
        <div id="rooms" className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4 text-center text-orange-600"
          >
            Các loại phòng
          </motion.h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center mb-8">
            Chúng tôi cung cấp nhiều loại phòng phù hợp với nhu cầu và ngân sách
            của sinh viên.
          </p>

          <Row gutter={[24, 24]}>
            {[0, 1, 2].map((index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <Badge.Ribbon text="Phổ biến" color="orange">
                    <Card
                      hoverable
                      cover={
                        <img
                          alt="Phòng 2 người"
                          src="/api/placeholder/500/300"
                        />
                      }
                      className="h-full border-0 shadow-lg"
                    >
                      <Meta
                        title="Phòng 2 người"
                        description={
                          <span className="font-bold text-orange-600">
                            Giá từ: 800.000đ/tháng/người
                          </span>
                        }
                      />
                      <ul className="mt-4">
                        <li className="flex items-center mb-2">
                          <CheckCircleOutlined className="text-orange-500 mr-2" />{" "}
                          Giường đơn
                        </li>
                        <li className="flex items-center mb-2">
                          <CheckCircleOutlined className="text-orange-500 mr-2" />{" "}
                          Bàn học
                        </li>
                        <li className="flex items-center">
                          <CheckCircleOutlined className="text-orange-500 mr-2" />{" "}
                          Tủ quần áo
                        </li>
                      </ul>
                      <Button
                        type="primary"
                        className="mt-4 w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 border-0"
                      >
                        Xem chi tiết
                      </Button>
                    </Card>
                  </Badge.Ribbon>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Tiện ích nổi bật */}
        <div id="facilities" className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4 text-center text-orange-600"
          >
            Tiện ích nổi bật
          </motion.h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center mb-8">
            Chúng tôi cung cấp đầy đủ tiện ích để đảm bảo sinh viên có môi
            trường sống tốt nhất.
          </p>

          <Row gutter={[24, 24]}>
            {[0, 1, 2, 3].map((index) => (
              <Col xs={24} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                  animate={{ y: [0, -10, 0] }}
                >
                  <Card className="text-center bg-gradient-to-b from-white to-orange-50 h-full border-0 shadow-lg">
                    <div className="text-orange-500 text-4xl mb-4">
                      <FireOutlined />
                    </div>
                    <h3 className="text-xl font-bold text-orange-600">
                      Canteen
                    </h3>
                    <p className="text-gray-600">
                      Đa dạng món ăn với giá sinh viên
                    </p>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Đăng ký */}
        <div id="register">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-8 rounded-lg mb-16 shadow-lg">
              <Row gutter={32} align="middle">
                <Col xs={24} md={12}>
                  <h2 className="text-3xl font-bold mb-4 text-orange-600">
                    Đăng ký ngay hôm nay
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Điền thông tin của bạn để đăng ký một chỗ ở trong ký túc xá
                    của chúng tôi. Chúng tôi sẽ liên hệ lại trong vòng 24 giờ.
                  </p>
                  <ul className="mb-4">
                    <li className="flex items-center mb-2">
                      <CheckCircleOutlined className="text-orange-500 mr-2" />{" "}
                      Quy trình đăng ký đơn giản
                    </li>
                    <li className="flex items-center mb-2">
                      <CheckCircleOutlined className="text-orange-500 mr-2" />{" "}
                      Không phí đăng ký
                    </li>
                    <li className="flex items-center">
                      <CheckCircleOutlined className="text-orange-500 mr-2" />{" "}
                      Hỗ trợ 24/7
                    </li>
                  </ul>
                </Col>
                <Col xs={24} md={12}>
                  <Card className="border-0 shadow-lg">
                    <Form layout="vertical">
                      <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên" },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined className="text-orange-500" />}
                          placeholder="Nhập họ tên"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className="text-orange-500" />}
                          placeholder="Nhập email"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                        ]}
                      >
                        <Input
                          prefix={<PhoneOutlined className="text-orange-500" />}
                          placeholder="Nhập số điện thoại"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item label="Loại phòng quan tâm" name="roomType">
                        <Input
                          placeholder="Ví dụ: Phòng 2 người, Phòng 4 người"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 border-0 rounded-lg h-12 text-lg"
                        >
                          Gửi đăng ký
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </div>
          </motion.div>
        </div>

        {/* FAQ với màu sắc */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4 text-center text-orange-600"
          >
            Câu hỏi thường gặp
          </motion.h2>
          <Row gutter={[16, 16]}>
            {[0, 1, 2, 3].map((index) => (
              <Col xs={24} md={12} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="h-full border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold mb-2 flex items-center text-orange-600">
                      <QuestionCircleOutlined className="text-orange-500 mr-2" />{" "}
                      Quy trình đăng ký phòng như thế nào?
                    </h3>
                    <p className="text-gray-600">
                      Điền thông tin vào mẫu đăng ký trên website hoặc trực tiếp
                      tại văn phòng KTX. Chúng tôi sẽ xác nhận và liên hệ lại
                      trong vòng 24 giờ.
                    </p>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Liên hệ */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div id="contact">
            <h2 className="text-3xl font-bold mb-4 text-center text-orange-600">
              Liên hệ với chúng tôi
            </h2>
            <Row gutter={[32, 32]}>
              {[0, 1, 2].map((index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="text-center h-full hover:shadow-xl transition-shadow bg-gradient-to-b from-white to-orange-50 border-0">
                      <div className="inline-block p-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white mb-4">
                        <PhoneOutlined style={{ fontSize: 24 }} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-orange-600">
                        Điện thoại
                      </h3>
                      <p className="text-gray-600">028.3123.4567</p>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.div>
      </Content>

      {/* Footer với fade-in animation */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-orange-900 to-yellow-900 text-white"
      >
        <div className="max-w-7xl mx-auto py-8 px-4">
          <Row gutter={[32, 24]}>
            <Col xs={24} md={8}>
              <h3 className="text-xl font-bold mb-4">KTX SINH VIÊN</h3>
              <p className="text-gray-300 mb-4">
                Môi trường sống lý tưởng cho sinh viên với đầy đủ tiện nghi và
                dịch vụ hỗ trợ.
              </p>
              <div className="flex gap-4">
                <Button
                  shape="circle"
                  icon={<i className="fab fa-facebook-f"></i>}
                  className="bg-blue-600 text-white border-0 hover:bg-blue-700"
                />
                <Button
                  shape="circle"
                  icon={<i className="fab fa-twitter"></i>}
                  className="bg-cyan-500 text-white border-0 hover:bg-cyan-600"
                />
                <Button
                  shape="circle"
                  icon={<i className="fab fa-instagram"></i>}
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white border-0"
                />
              </div>
            </Col>
            <Col xs={24} md={8}>
              <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Loại phòng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Tiện ích
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Quy định
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Liên hệ
                  </a>
                </li>
              </ul>
            </Col>
            <Col xs={24} md={8}>
              <h3 className="text-xl font-bold mb-4">Giờ làm việc</h3>
              <p className="text-gray-300 mb-2">
                Thứ Hai - Thứ Sáu: 8:00 - 17:00
              </p>
              <p className="text-gray-300 mb-2">Thứ Bảy: 8:00 - 12:00</p>
              <p className="text-gray-300">Chủ Nhật: Đóng cửa</p>
              <p className="text-gray-300 mt-4">
                Văn phòng quản lý KTX luôn sẵn sàng hỗ trợ bạn.
              </p>
            </Col>
          </Row>
          <Divider className="border-yellow-800" />
          <div className="text-center text-gray-300">
            <p>
              &copy; {new Date().getFullYear()} Ký túc xá Sinh viên. Bản quyền
              thuộc về KTX Sinh viên.
            </p>
          </div>
        </div>
      </motion.footer>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex justify-around items-center py-3 px-2">
          {[
            { icon: <HomeOutlined />, text: "Trang chủ", section: "home" },
            { icon: <BankOutlined />, text: "Phòng ở", section: "rooms" },
            {
              icon: <CoffeeOutlined />,
              text: "Tiện ích",
              section: "facilities",
            },
            { icon: <PhoneOutlined />, text: "Liên hệ", section: "contact" },
            { icon: <UserOutlined />, text: "Đăng ký", section: "register" },
          ].map((item, index) => (
            <motion.div
              key={index}
              onClick={() => scrollToSection(item.section)}
              className="flex flex-col items-center w-16"
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full mb-1">
                <span className="text-xl active:text-orange-500">
                  {item.icon}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-600">
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
