import { ICON_SIZE_SMALL } from "@/constants";
import { Trash } from "@phosphor-icons/react";
import { Image } from "antd";
import { RcFile } from "antd/es/upload";
import { FC, MouseEvent, useCallback } from "react";

type Props = {
  file: RcFile | string,
  enableRemove?: boolean,
  onRemoveFile?: (file: RcFile | string) => void;
}

const SingleUpload: FC<Props> = ({
  file,
  enableRemove,
  onRemoveFile,
}) => {
  const handleRemoveFile = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onRemoveFile?.(file);
  }, [file, onRemoveFile]);

  return (
    <>
      <Image
        src={typeof file === "string" ? file : URL.createObjectURL(file)}
        alt="Image"
        className="!self-center !justify-self-center rounded-lg !h-fit !w-11/12"
        preview={false}
      />
      <div className="absolute top-2 right-2 black-40 backdrop-blur-lg flex items-center gap-1">
        {enableRemove && (
          <div
            className="cursor-pointer"
            onClick={handleRemoveFile}>
            <Trash size={ICON_SIZE_SMALL} weight="bold" />
          </div>
        )}
      </div>
    </>
  )
}

export default SingleUpload;
