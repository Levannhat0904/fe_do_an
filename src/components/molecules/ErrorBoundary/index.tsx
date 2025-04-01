import React, { type FC } from "react";

import { Button, Result } from "antd";
import { Routers } from "@/constants";

type Props = {
  error: Error & { digest?: string | undefined };
  reset: () => void;
};

const ErrorBoundary: FC<Props> = ({ error, reset }) => {
  if (!error) return;

  console.error({ error });

  return (
    <Result
      status="error"
      title="Đã xảy ra sự cố!"
      subTitle="Xin vui tải lại trang hoặc thử lại sau."
      extra={[
        <Button key="reload" onClick={() => reset()}>
          Tải lại trang
        </Button>,
        <Button key="homepage" href={Routers.home} type="primary">
          Quay lại trang chủ
        </Button>,
      ]}
    ></Result>
  );
};

export default ErrorBoundary;
