"use client";

import {
  ICON_SIZE_SMALL,
  ICON_WEIGHT_DEFAULT,
  InputType,
  Routers,
} from "@/constants";
import React, { useState, useEffect } from "react";
import { Lock, CheckCircle } from "@phosphor-icons/react";
import { AuthForm } from "@/components/organisms";
import { getDefaultRules } from "@/utils";
import { KButton, KText } from "@/components/atoms";
import Link from "next/link";
import { resetPassword } from "@/api/auth";
import { message, notification } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setTokenError(true);
      message.error("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const onFinish = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, values.password);
      setResetSuccess(true);
      console.log("resetSuccess", resetSuccess);
      message.success("Mật khẩu đã được đặt lại thành công.");
    } catch (error) {
      console.error("Error resetting password:", error);
      notification.error({
        key: "resetPassword",
        message: "Đã xảy ra lỗi khi đặt lại mật khẩu.",
      });
      alert("Đã xảy ra lỗi khi đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordFields = [
    {
      label: "Mật khẩu mới",
      name: "password",
      type: InputType.password,
      placeholder: "Nhập mật khẩu mới",
      rules: [
        getDefaultRules("Vui lòng nhập mật khẩu mới!", false),
        {
          min: 6,
          message: "Mật khẩu phải có ít nhất 6 ký tự!",
        },
      ],
      icon: <Lock size={ICON_SIZE_SMALL} weight={ICON_WEIGHT_DEFAULT} />,
    },
    {
      label: "Nhập lại mật khẩu",
      name: "confirmPassword",
      type: InputType.password,
      placeholder: "Nhập lại mật khẩu mới",
      rules: [getDefaultRules("Vui lòng nhập lại mật khẩu!", false)],
      icon: <Lock size={ICON_SIZE_SMALL} weight={ICON_WEIGHT_DEFAULT} />,
    },
  ];

  if (tokenError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-red-500">
          Liên kết không hợp lệ
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
        </p>
        <Link href={Routers.forgotPassword} className="w-full mb-3">
          <KButton type="primary" block>
            Yêu cầu liên kết mới
          </KButton>
        </Link>
        <Link href={Routers.login} className="w-full">
          <KButton type="default" block>
            Quay lại đăng nhập
          </KButton>
        </Link>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-2 bg-transparent rounded-lg shadow-md max-w-md mx-auto">
        <CheckCircle size={64} weight="duotone" className="text-green-500" />
        <h2 className="text-xl font-bold s5-regular">
          Đặt lại mật khẩu thành công
        </h2>
        <p className="text-gray-600 s5-regular text-center">
          Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng
          mật khẩu mới.
        </p>
        <Link href={Routers.login} className="w-full">
          <KButton type="primary" block className="s5-regular">
            Đăng nhập ngay
          </KButton>
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-gray-600 s5-regular text-center">
        Vui lòng nhập mật khẩu mới cho tài khoản của bạn
      </p>
      <AuthForm
        fields={resetPasswordFields}
        onFinish={onFinish}
        submitLabel="Đặt lại mật khẩu"
        formClassName="w-full"
        submitLoading={loading}
      />
      <div className=" w-full flex justify-center">
        <Link href={Routers.login}>
          <KText className="s5-regular">Quay lại đăng nhập</KText>
        </Link>
      </div>
    </>
  );
}
