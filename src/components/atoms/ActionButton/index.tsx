import React from 'react';
import { Button, ButtonProps } from 'antd';

interface ActionButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};

export default ActionButton; 