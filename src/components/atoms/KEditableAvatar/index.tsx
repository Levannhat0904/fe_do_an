import React, { FC, useCallback, useMemo, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Avatar, message, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { User } from "@phosphor-icons/react";
import { ICON_WEIGHT_DEFAULT } from "@/constants";
import { getBase64 } from "@/utils";
import { UploadChangeParam } from "antd/es/upload";
import Image from "next/image";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

type Props = {
  src?: string;
  onFileChange?: (file: File) => void;
};

const KEditableAvatar: FC<Props> = ({ src, onFileChange }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const beforeUpload = useCallback((file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Ảnh chỉ nhận định dạng JPG/PNG!");
    }
    const isLargerThan10MB = file.size / 1024 / 1024 < 10;
    if (!isLargerThan10MB) {
      message.error("Ảnh không được quá 10MB!");
    }
    return isJpgOrPng && isLargerThan10MB;
  }, []);

  const handleChange: UploadProps["onChange"] = useCallback(
    (info: UploadChangeParam<UploadFile>) => {
      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info.file.status === "done") {
        getBase64(info.file.originFileObj as FileType, (url) => {
          setLoading(false);
          setImageUrl(url);
        });
        if (info.file.originFileObj) {
          onFileChange?.(info.file.originFileObj);
        }
      }
    },
    [onFileChange]
  );

  const uploadButton = useMemo(
    () => (
      <>
        {loading ? (
          <LoadingOutlined />
        ) : (
          <div className="relative cursor-pointer">
            <Avatar
              className="!rounded-xl !bg-neutral4"
              shape="square"
              size={120}
              icon={
                <User
                  className="!text-sdark4"
                  size={67}
                  weight={ICON_WEIGHT_DEFAULT}
                />
              }
              src={src}
            />
            {!src && (
              <div className="absolute bottom-2 left-12 sbody-code text-primary6">
                Edit
              </div>
            )}
          </div>
        )}
      </>
    ),
    [src, loading]
  );

  return (
    <div className="flex items-center gap-4">
      <Upload
        name="avatar"
        listType="picture"
        className="!w-32 !h-32 !object-cover !rounded-xl"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="avatar"
            className="!w-32 !h-32 !object-cover !rounded-xl !cursor-pointer"
          />
        ) : (
          uploadButton
        )}
      </Upload>
      <span className="sbody-code text-sdark4">
        Dụng lượng file tối đa 10 MB <br />
        Định dạng:.JPEG, .PNG
      </span>
    </div>
  );
};

export default KEditableAvatar;
