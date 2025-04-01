import React, { type FC } from "react";
import { Breadcrumb, BreadcrumbProps } from "antd";

const KBreadcrumb: FC<BreadcrumbProps> = ({ ...rest }) => {
  return <Breadcrumb {...rest} />;
};

export default KBreadcrumb;
