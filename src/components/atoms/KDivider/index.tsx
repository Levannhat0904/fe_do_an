import React, { FC } from "react";
import { Divider, DividerProps } from "antd";

import { cn } from "@/utils";

const KDivider: FC<DividerProps> = ({ className, ...rest }) => {
  return <Divider {...rest} className={cn("h-px self-stretch", className)} />;
};

export default KDivider;
