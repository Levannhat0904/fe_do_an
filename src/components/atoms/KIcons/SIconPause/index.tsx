import { FC, SVGProps } from "react";

const SIconPause: FC<SVGProps<SVGSVGElement>> = (props) => {
  const { ...rest } = props;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="20" height="20" rx="10" fill="#b3b3b3" />
      <rect x="6" y="5" width="3" height="10" fill="white" />
      <rect x="11" y="5" width="3" height="10" fill="white" />
    </svg>
  );
};

export default SIconPause;
