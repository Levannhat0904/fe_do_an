import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Radio,
  message,
  Modal,
  Spin,
  Alert,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import Image from "next/image";
import { useCreateMaintenanceRequest } from "@/api/student";

interface MaintenanceRequestFormProps {
  studentId?: number;
  roomId?: number;
  onSuccess: () => void;
}

/**
 * Component form tạo yêu cầu bảo trì
 * Cho phép sinh viên nhập thông tin yêu cầu bảo trì như: loại yêu cầu, mô tả, mức độ ưu tiên
 * Hỗ trợ upload hình ảnh kèm theo
 */
const MaintenanceRequestForm: React.FC<MaintenanceRequestFormProps> = ({
  studentId,
  roomId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Use the real API mutation
  const createRequestMutation = useCreateMaintenanceRequest();
  const submitting = createRequestMutation.isPending;

  // Check if student is assigned to a room
  const hasValidRoom = roomId && roomId > 0;

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ có thể tải lên file JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const onFinish = async (values: any) => {
    setError(null);

    if (!studentId) {
      setError("Không tìm thấy thông tin sinh viên!");
      return;
    }

    if (!hasValidRoom) {
      setError("Bạn chưa được phân phòng nên không thể tạo yêu cầu bảo trì!");
      return;
    }

    try {
      const requestData = {
        studentId,
        roomId,
        requestType: values.requestType,
        description: values.description,
        priority: values.priority,
        images: fileList,
      };

      await createRequestMutation.mutateAsync(requestData);
      form.resetFields();
      setFileList([]);
      onSuccess();
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
      setError("Không thể gửi yêu cầu bảo trì. Vui lòng thử lại sau.");
    }
  };

  if (!hasValidRoom) {
    return (
      <Alert
        message="Thông báo"
        description="Bạn chưa được phân phòng nên không thể tạo yêu cầu bảo trì. Vui lòng liên hệ với quản lý KTX."
        type="warning"
        showIcon
      />
    );
  }

  return (
    <>
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          closable
          onClose={() => setError(null)}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ priority: "normal" }}
      >
        <Form.Item
          name="requestType"
          label="Loại yêu cầu"
          rules={[{ required: true, message: "Vui lòng chọn loại yêu cầu" }]}
        >
          <Input placeholder="Ví dụ: Sửa chữa điện, nước,..." />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả chi tiết"
          rules={[{ required: true, message: "Vui lòng nhập mô tả chi tiết" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Mô tả chi tiết về vấn đề của bạn"
          />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          rules={[{ required: true, message: "Vui lòng chọn mức độ ưu tiên" }]}
        >
          <Radio.Group>
            <Radio value="low">Thấp</Radio>
            <Radio value="normal">Trung bình</Radio>
            <Radio value="high">Cao</Radio>
            <Radio value="urgent">Khẩn cấp</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="images" label="Hình ảnh (nếu có)">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            maxCount={3}
          >
            {fileList.length >= 3 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button style={{ marginRight: 8 }} onClick={() => onSuccess()}>
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ background: "#fa8c16", borderColor: "#fa8c16" }}
            loading={submitting}
          >
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <Image
          alt="example"
          width={500}
          height={300}
          style={{ width: "100%", height: "auto" }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default MaintenanceRequestForm;
