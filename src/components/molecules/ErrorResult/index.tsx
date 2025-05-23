import React from 'react';
import { Result, Button } from 'antd';

interface ErrorResultProps {
  title: string;
  subTitle: string;
  onBack: () => void;
  backText?: string;
  status?: 'error' | 'warning' | '404' | '403' | '500';
}

const ErrorResult: React.FC<ErrorResultProps> = ({
  title,
  subTitle,
  onBack,
  backText = "Quay lại",
  status = "error"
}) => {
  return (
    <div style={{ textAlign: "center", margin: "50px" }}>
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          <Button type="primary" onClick={onBack}>
            {backText}
          </Button>
        }
      />
    </div>
  );
};

export default ErrorResult; 