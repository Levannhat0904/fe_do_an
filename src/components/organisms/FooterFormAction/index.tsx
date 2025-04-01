import { KButton } from "@/components/atoms";
import { ButtonProps } from "antd";
import React from "react";

type FooterFormActionProps = {
  cancelText?: string;
  submitText?: string;
  loading?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelButtonProps?: ButtonProps;
  submitButtonProps?: ButtonProps;
  disableSubmitButton?: boolean | undefined;
};

function FooterFormAction({
  cancelText = "Hủy bỏ",
  submitText = "Tiếp tục",
  loading = false,
  onCancel,
  onSubmit,
  cancelButtonProps,
  submitButtonProps,
  disableSubmitButton,
}: FooterFormActionProps) {
  return (
    <div className="flex gap-2 justify-end">
      <KButton {...cancelButtonProps} onClick={onCancel}>
        {cancelText}
      </KButton>
      <KButton
        {...submitButtonProps}
        onClick={onSubmit}
        loading={loading}
        type="primary"
        disabled={disableSubmitButton}
      >
        {submitText}
      </KButton>
    </div>
  );
}

export default FooterFormAction;
