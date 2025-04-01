import React, { FC } from "react";
import { Badge, BadgeProps } from "antd";

const KBadge: FC<BadgeProps> = ({ status, children, ...rest }) => {
  return (
    <Badge status={status} {...rest}>
      {children}
    </Badge>
  );
};

export default KBadge;
