import { Checkbox } from "antd";

interface KCheckboxAtomProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const KCheckboxAtom: React.FC<KCheckboxAtomProps> = ({
  checked,
  onChange,
  className,
}) => (
  <Checkbox
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    className={className}
  />
);

export default KCheckboxAtom;
