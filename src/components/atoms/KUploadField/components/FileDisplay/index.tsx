import { Image } from "antd";
import { FC } from "react";
import styles from "./styles.module.scss";
import { RcFile } from "antd/es/upload";
import { ArrowClockwise, Trash } from "@phosphor-icons/react";
import { MEDIUM_IMAGE_SIZE, ICON_SIZE_SMALL } from "@/constants";

type Props = {
  fileList: RcFile[]
  defaultImage?: string,
  isDefault?: boolean,
  multiple?: boolean,
  enableRemove?: boolean,
  onReplaceFile?: (file: RcFile, index: number) => void,
  onRemoveFile?: (file: RcFile) => void,
}

const FilesDisplay: FC<Props> = ({
  fileList,
  defaultImage,
  isDefault,
  multiple,
  enableRemove,
  onReplaceFile,
  onRemoveFile,
}) => {
  return (
    <>
      {isDefault && fileList && fileList?.length === 0 && (
        <div
          className={`${styles.defaultImage} size-40 rounded-xl relative`}>
          <Image
            src={defaultImage || ""}
            alt="Default Image"
            width={MEDIUM_IMAGE_SIZE}
            height={MEDIUM_IMAGE_SIZE}
            className="size-40 object-cover rounded-xl"
            preview={false}
          />
        </div>
      )}
      {multiple && fileList?.map((file: any, index: number) => (file &&
        <div key={`${index}-${file?.uid}`} className="size-40 relative rounded-lg">
          <Image
            src={typeof file === "string" ? file : URL.createObjectURL(file?.originFileObj || file)}
            width={MEDIUM_IMAGE_SIZE}
            height={MEDIUM_IMAGE_SIZE}
            alt="Image"
            className="rounded-lg object-cover size-40"
            preview={false}
          />
          <div className="absolute top-1 right-1 black-40 backdrop-blur-lg flex items-center gap-1">
            <div
              className="cursor-pointer"
              onClick={() => onReplaceFile?.(file, index)}>
              <ArrowClockwise size={ICON_SIZE_SMALL} weight="bold" />
            </div>
            {enableRemove && <div
              className="cursor-pointer"
              onClick={() => onRemoveFile?.(file)}>
              <Trash size={ICON_SIZE_SMALL} weight="bold" />
            </div>}
          </div>
        </div>
      ))}
    </>
  )
}

export default FilesDisplay;
