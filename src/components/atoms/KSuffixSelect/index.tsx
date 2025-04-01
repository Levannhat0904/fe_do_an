import { Select, SelectProps } from "antd";
import React from "react";

const KSuffixSelect = (props: SelectProps) => {
  return (
    <div className={`w-full`} onClick={(event) => event.stopPropagation()}>
      <Select {...props} />
    </div>
  );
};

export default KSuffixSelect;
