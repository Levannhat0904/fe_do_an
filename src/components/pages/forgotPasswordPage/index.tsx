"use client";

import {
  ICON_SIZE_SMALL,
  ICON_WEIGHT_DEFAULT,
  InputType,
  Routers,
} from "@/constants";
import React, { useState } from "react";
import { EnvelopeSimple } from "@phosphor-icons/react";
import { AuthForm } from "@/components/organisms";
import { getDefaultRules } from "@/utils";
import { KButton, KText } from "@/components/atoms";
import Link from "next/link";
import { forgotPassword } from "@/api/auth";
import { message } from "antd";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onFinish = async (values: { email: string }) => {
    try {
      setLoading(true);
      await forgotPassword(values.email);
      setEmailSent(true);
      message.success(
        "Yêu cầu đặt lại mật khẩu đã được gửi đi. Vui lòng kiểm tra email của bạn."
      );
    } catch (error) {
      console.error("Error requesting password reset:", error);
      message.error("Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const forgotPasswordFields = [
    {
      label: "Email",
      name: "email",
      type: InputType.text,
      placeholder: "Nhập email đã đăng ký",
      rules: [
        getDefaultRules("Vui lòng nhập email đã đăng ký!", false),
        {
          type: "email",
          message: "Vui lòng nhập đúng định dạng email!",
        },
      ],
      icon: (
        <EnvelopeSimple size={ICON_SIZE_SMALL} weight={ICON_WEIGHT_DEFAULT} />
      ),
    },
  ];

  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center p-2 bg-transparent rounded-lg shadow-md max-w-md mx-auto">
        <EnvelopeSimple
          size={64}
          weight="duotone"
          className="text-blue-500 mb-4"
        />
        <h2 className="text-xl font-bold s4 mb-4">Kiểm tra email của bạn</h2>
        <p className="text-gray-600 s5-regular mb-6 text-center">
          Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui
          lòng kiểm tra hộp thư và làm theo hướng dẫn.
        </p>
        <p className="text-gray-500 s5-regular mb-6 text-center">
          Nếu không nhận được email, vui lòng kiểm tra thư mục spam hoặc thử lại
          sau ít phút.
        </p>
        <Link href={Routers.login} className="w-full">
          <KButton type="primary" block className="s5-regular">
            Quay lại đăng nhập
          </KButton>
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-gray-600 s5-regular mb-6 text-center">
        Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu
      </p>
      <AuthForm
        fields={forgotPasswordFields}
        onFinish={onFinish}
        submitLabel="Gửi yêu cầu"
        formClassName="w-full"
        submitLoading={loading}
      />
      <div className="mt-6 w-full flex justify-center">
        <Link href={Routers.login}>
          <KText className="s5-regular">Quay lại đăng nhập</KText>
        </Link>
      </div>
    </>
  );
}
