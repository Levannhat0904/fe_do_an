import React, { FC } from "react";
import { Progress, ProgressProps } from "antd";

const KProgress: FC<ProgressProps> = ({
  type = "circle",
  size = [50, 50],
  showInfo = false,
  percent,
  ...rest
}) => {
  return (
    <Progress
      type={type}
      size={size}
      percent={percent}
      showInfo={showInfo}
      {...rest}
    />
  );
};

export default KProgress;
