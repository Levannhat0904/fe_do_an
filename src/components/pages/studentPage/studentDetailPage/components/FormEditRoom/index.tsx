import { Student } from "@/types/student";
import { Form, FormInstance, Input, Select, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/constants/values";

type IProps = {
  form: FormInstance;
  student: Student;
};

interface Building {
  value: number;
  label: string;
  totalRooms: number;
  availableRooms: number;
}

interface Room {
  value: number;
  label: string;
  floorNumber: number;
  roomType: string;
  capacity: number;
  currentOccupancy: number;
  pricePerMonth: number;
  availableBeds: number;
}

const FormEditRoom = (props: IProps) => {
  const { form, student } = props;
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [buildingsLoading, setBuildingsLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);

  // Fetch buildings data
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setBuildingsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/buildings/available`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setBuildings(response.data.data);
        }
        setBuildingsLoading(false);
      } catch (error) {
        console.error("Error fetching buildings:", error);
        setBuildingsLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  // When building selection changes, fetch available rooms
  const handleBuildingChange = async (buildingId: number) => {
    try {
      setRoomsLoading(true);
      setSelectedBuilding(buildingId);
      form.setFieldValue("roomId", undefined);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/buildings/${buildingId}/rooms/available`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            gender: student?.gender, // Filter rooms by student gender
          },
        }
      );

      if (response.data.success) {
        setRooms(response.data.data);
        // If a room is selected, auto-populate the price
        form.setFieldValue("monthlyFee", null);
      }
      setRoomsLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRoomsLoading(false);
    }
  };

  // When room selection changes, set the default price
  const handleRoomChange = (roomId: number) => {
    const selectedRoom = rooms.find((room) => room.value === roomId);
    if (selectedRoom) {
      form.setFieldValue("monthlyFee", selectedRoom.pricePerMonth);
    }
  };

  // Generate bed numbers based on available beds
  const generateBedOptions = () => {
    const selectedRoomId = form.getFieldValue("roomId");
    const selectedRoom = rooms.find((room) => room.value === selectedRoomId);

    if (!selectedRoom) return [];

    const options = [];
    const availableBeds = selectedRoom.availableBeds || 0;
    const totalBeds = selectedRoom.capacity || 0;
    const occupiedBeds = totalBeds - availableBeds;

    // Generate bed numbers
    for (let i = 1; i <= totalBeds; i++) {
      // Skip beds that are already occupied
      if (i <= occupiedBeds) continue;

      options.push({
        label: `Giường ${i}`,
        value: i.toString(),
      });
    }

    return options;
  };

  return (
    <Form form={form} layout="vertical" className="mt-4">
      <Form.Item
        name="buildingId"
        label="Tòa nhà"
        rules={[{ required: true, message: "Vui lòng chọn tòa nhà" }]}
      >
        <Select
          placeholder="Chọn tòa nhà"
          loading={buildingsLoading}
          onChange={handleBuildingChange}
          options={buildings}
        />
      </Form.Item>
      <Form.Item
        name="roomId"
        label="Phòng"
        rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
      >
        <Select
          placeholder="Chọn phòng"
          loading={roomsLoading}
          disabled={!selectedBuilding}
          options={rooms}
          onChange={handleRoomChange}
        />
      </Form.Item>
      <Form.Item name="semester" label="Học kỳ">
        <Select placeholder="Chọn học kỳ">
          <Select.Option value="1">Học kỳ 1</Select.Option>
          <Select.Option value="2">Học kỳ 2</Select.Option>
          <Select.Option value="3">Học kỳ hè</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="schoolYear" label="Năm học">
        <Input placeholder="Ví dụ: 2023-2024" />
      </Form.Item>
      <Form.Item
        name="monthlyFee"
        label="Phí hàng tháng"
        rules={[{ required: true, message: "Vui lòng nhập phí hàng tháng" }]}
      >
        <InputNumber
          placeholder="Nhập phí hàng tháng"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          style={{ width: "100%" }}
          addonAfter="VNĐ"
        />
      </Form.Item>
      <Form.Item
        name="depositAmount"
        label="Tiền đặt cọc"
        rules={[{ required: true, message: "Vui lòng nhập tiền đặt cọc" }]}
      >
        <InputNumber
          placeholder="Nhập tiền đặt cọc"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          style={{ width: "100%" }}
          addonAfter="VNĐ"
        />
      </Form.Item>
    </Form>
  );
};

export default FormEditRoom;
