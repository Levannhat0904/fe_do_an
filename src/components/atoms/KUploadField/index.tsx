"use client";
import { CloudUploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import React, { FC, ReactNode, useCallback, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Form, FormInstance, Upload } from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { validateFileSize } from "@/utils";
import SButton from "../KButton";
import { Image as IconImage } from "@phosphor-icons/react";
import SText from "../KText";
import { colors, IconWeightType } from "@/constants";
import SingleUpload from "./components/SingleUpload";
import FilesDisplay from "./components/FileDisplay";

const { Dragger } = Upload;

type Props = {
  name: string;
  help?: string;
  multiple?: boolean;
  accept?: string;
  isDefault?: boolean;
  defaultImage?: string;
  fieldActions?: FormInstance;
  maxSize?: number; // In mb
  minCount?: number;
  placeholder?: string | ReactNode;
  className?: string;
};

const UploadField: FC<Props> = ({
  help,
  multiple,
  accept,
  isDefault,
  defaultImage,
  fieldActions,
  name,
  maxSize,
  minCount,
  placeholder,
  className,
  ...rest
}) => {
  const ref = useRef<any>();
  const [replaceFileIndex, setReplaceFileIndex] = useState<number | null>(null);

  const fileList = Form.useWatch(name) || []; // Đảm bảo fileList luôn là một mảng

  const handleBeforeUpload = useCallback((file: RcFile) => {
    const reader = new FileReader();

    reader.onload = () => {};
    reader.readAsText(file);

    // Prevent upload
    return false;
  }, []);

  const handleRemoveFile = useCallback(
    (file: any) => {
      if (multiple) {
        let newFileList = [];
        if (typeof file === "string") {
          newFileList = fileList?.filter((record: any) => record !== file);
        } else {
          newFileList = fileList?.filter(
            (record: any) => record?.uid !== file?.uid
          );
        }

        fieldActions?.setFieldValue(name, newFileList);
      } else {
        fieldActions?.setFieldValue(name, undefined);
      }
    },
    [fileList, fieldActions, multiple, name]
  );

  const validateFile = useCallback(
    (file: UploadFile) => {
      const acceptList = accept
        ?.split(",")
        ?.filter((record) => record)
        ?.map((record) => record?.trim());

      if (accept && file?.type) {
        const isImage = acceptList?.includes(file?.type);

        if (!isImage) {
          fieldActions?.setFields([
            {
              name,
              errors: ["Vui lòng chọn file ảnh có định dạng JPG, JPEG, PNG"],
            },
          ]);
          return false;
        }
      }

      const isLimitFileSize = validateFileSize(file?.size, maxSize);

      if (maxSize && !isLimitFileSize) {
        fieldActions?.setFields([
          {
            name,
            errors: ["Vui lòng chọn ảnh có kích thước không vượt quá 10mb"],
          },
        ]);
        return false;
      }

      return true;
    },
    [fieldActions, accept, maxSize, multiple, name]
  );

  const handleUploadChange = useCallback(
    (data: UploadChangeParam<UploadFile>) => {
      let isValid = true;

      if (multiple) {
        data?.fileList?.forEach((file) => {
          if (!validateFile(file)) {
            isValid = false;
          }
        });
      } else {
        isValid = validateFile(data?.file);
      }

      if (!isValid) {
        return;
      }

      fieldActions?.setFields([
        {
          name,
          errors: [],
        },
      ]);

      if (replaceFileIndex !== null) {
        const updatedFileList = [...fileList];
        const newFile = {
          ...data?.file,
          uid: fileList[replaceFileIndex]?.uid,
          originFileObj: data?.file?.originFileObj || data?.file,
        };
        updatedFileList[replaceFileIndex] = newFile;
        fieldActions?.setFieldValue(name, updatedFileList);
        setReplaceFileIndex(null);
      } else {
        fieldActions?.setFieldValue(
          name,
          multiple ? [...fileList, ...data?.fileList] : data?.file
        );
      }
    },
    [fileList, replaceFileIndex, fieldActions, multiple, name]
  );

  const handleReplaceFile = useCallback((file: UploadFile, index: number) => {
    setReplaceFileIndex(index);
    ref.current.upload.uploader.fileInput.click();
  }, []);

  return (
    <div
      className={`flex flex-col justify-center my-0 mx-auto gap-5 ${className}`}
    >
      <div
        className={`relative flex items-center justify-center gap-5 flex-wrap`}
      >
        <FilesDisplay
          fileList={fileList}
          defaultImage={defaultImage}
          isDefault={isDefault}
          multiple={multiple}
          enableRemove={
            minCount !== undefined ||
            minCount !== 0 ||
            (minCount && fileList?.length > minCount)
          }
          onReplaceFile={handleReplaceFile}
          onRemoveFile={handleRemoveFile}
        />
        <Dragger
          openFileDialogOnClick
          ref={ref}
          action={undefined}
          multiple={multiple}
          beforeUpload={handleBeforeUpload}
          accept={accept}
          className={`${styles.container} ${className}`}
          showUploadList={false}
          onChange={handleUploadChange}
          fileList={[]}
          {...rest}
        >
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-5 items-center">
              <div className="flex flex-col justify-center items-center gap-3">
                {!multiple && !Array.isArray(fileList) && fileList ? (
                  <SingleUpload
                    file={fileList}
                    enableRemove={
                      minCount !== undefined ||
                      minCount !== 0 ||
                      (minCount && fileList?.length > minCount)
                    }
                    onRemoveFile={handleRemoveFile}
                  />
                ) : (
                  <>
                    <IconImage
                      weight={IconWeightType.regular}
                      size={32}
                      color={colors.sdark3}
                    />
                    {placeholder ?? (
                      <SText className="text-sdark2 s5-regular">
                        Tải ảnh lên hoặc kéo thả ảnh vào
                      </SText>
                    )}
                  </>
                )}
              </div>
              <SButton
                className="border !border-primary6 !rounded-lg !text-primary6 !h-10"
                type="default"
                icon={<CloudUploadOutlined className="text-2xl" />}
              >
                <SText className="text-primary6 s5-medium">Tải lên</SText>
              </SButton>
            </div>
          </div>
        </Dragger>
      </div>
      {help && (
        <div className="flex items-center gap-1 justify-center">
          <InfoCircleOutlined className="" />
          <span className="text-xs max-w-sm">{help}</span>
        </div>
      )}
    </div>
  );
};

export default UploadField;
