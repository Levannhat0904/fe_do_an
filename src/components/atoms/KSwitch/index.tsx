import React from "react";
import { Switch } from "antd";

interface KSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const KSwitch: React.FC<KSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return <Switch checked={checked} onChange={onChange} disabled={disabled} />;
};

export default KSwitch;
