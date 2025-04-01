import { Tabs, TabsProps } from "antd";
import React from "react";

interface KSTabs extends TabsProps {}

const KTabs = (props: KSTabs) => {
  return <Tabs {...props} />;
};

export default KTabs;
