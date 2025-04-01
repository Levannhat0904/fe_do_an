import React from "react";
import clsx from "clsx";

interface KNavigationButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const KNavigationButton: React.FC<KNavigationButtonProps> = ({
  className,
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx("custom-navigation-button", className)}
    >
      {children}
    </button>
  );
};

export default KNavigationButton;
