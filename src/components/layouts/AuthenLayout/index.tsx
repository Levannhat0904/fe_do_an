import { AuthFormTitle } from "@/components/molecules";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthenLayout(props: Props) {
  const { children } = props;
  return (
    <div className="bg-login_bg bg-cover bg-center bg-no-repeat w-full h-screen overflow-y-scroll min-h-screen md:pb-7 pb-2 flex flex-col items-center">
      <div className="flex-1 w-full flex items-center">
        <div className="flex flex-col gap-[42px] items-center md:h-fit h-full md:max-w-[380px] w-full max-w-full m-auto bg-auth_form rounded-[20px] p-10">
          <AuthFormTitle />
          {children}
        </div>
      </div>
      <span className="font-averta text-base font-normal leading-6 text-white text-center">
        Phát triển bởi Lê Văn Nhật
      </span>
    </div>
  );
}
