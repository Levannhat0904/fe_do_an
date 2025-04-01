"use client";

import {
  ICON_SIZE_SMALL,
  InputType,
  Routers,
  ICON_WEIGHT_DEFAULT,
  TFormLoginParams,
} from "@/constants";
import React from "react";
import { EnvelopeSimple, Lock } from "@phosphor-icons/react";
import { AuthForm } from "@/components/organisms";
import Link from "next/link";
import { getDefaultRules } from "@/utils";
import { KText } from "@/components/atoms";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { loginLoading, onLogin } = useAuth();

  const onFinish = (values: TFormLoginParams) => {
    onLogin(values);
  };

  const loginFields = [
    {
      label: "Email",
      name: "email",
      type: InputType.text,
      placeholder: "Nhập email của bạn",
      rules: [getDefaultRules("Vui lòng nhập email của bạn!", false)],
      icon: (
        <EnvelopeSimple size={ICON_SIZE_SMALL} weight={ICON_WEIGHT_DEFAULT} />
      ),
    },
    {
      label: "Mật khẩu",
      name: InputType.password,
      type: InputType.password,
      placeholder: "Mật khẩu đăng nhập",
      rules: [getDefaultRules("Vui lòng nhập mật khẩu đăng nhập!", false)],
      icon: <Lock size={ICON_SIZE_SMALL} weight={ICON_WEIGHT_DEFAULT} />,
      under: (
        <div className="mt-6 w-full flex justify-end">
          <Link href={Routers.forgotPassword}>
            <KText className="sbody-code">Quên mật khẩu?</KText>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AuthForm
      fields={loginFields}
      onFinish={onFinish}
      submitLabel="Đăng nhập"
      formClassName="w-full"
      submitLoading={loginLoading}
    />
  );
}
