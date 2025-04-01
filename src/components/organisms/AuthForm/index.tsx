"use client";
import { KButton, KInput, KText } from "@/components/atoms";
import { InputType } from "@/constants";
import { cn } from "@/utils";
import { Form } from "antd";
import React, { useCallback, useEffect } from "react";

export interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  rules?: any[];
  icon?: React.ReactNode;
  isShowRequiredPassword?: boolean;
  dependencies?: string[];
  hasFeedback?: boolean;
  messageError?: string;
  isShowForgotPassword?: boolean;
  under?: React.ReactNode;
  className?: string;
  isHiddenFormLabel?: boolean;
  valuePropName?: string;
}

interface Props {
  initialValues?: any;
  fields: FormField[];
  onFinish: (values: any) => void;
  submitLabel: string;
  formClassName?: string;
  submitLoading?: boolean;
  onValuesChange?: (values: any) => void;
}

export default function AuthForm(props: Props) {
  const {
    initialValues,
    fields,
    onFinish,
    submitLabel,
    formClassName,
    submitLoading,
    onValuesChange,
  } = props;
  const [form] = Form.useForm();

  const renderFormHelper = useCallback((field: FormField) => {
    switch (field.type) {
      case InputType.text:
        return (
          <KInput
            className={"h-[38px]"}
            prefix={field.icon}
            placeholder={field.placeholder}
          />
        );
      case InputType.password:
        return (
          <KInput
            className={"h-[38px]"}
            prefix={field.icon}
            placeholder={field.placeholder}
            inputType={field.type}
          />
        );

      default:
        return null;
    }
  }, []);

  const renderFormLayout = useCallback(() => {
    return (
      <Form.Item className="!mb-0">
        {fields.map((field) => (
          <Form.Item key={field.name} className="!mb-6">
            <Form.Item
              label={
                !field.isHiddenFormLabel && (
                  <KText className="sbody-code">{field.label}</KText>
                )
              }
              name={field.name}
              rules={field.rules}
              dependencies={field.dependencies}
              hasFeedback={field.hasFeedback}
              className={cn("!mb-0", field?.className)}
              valuePropName={field?.valuePropName}
            >
              {renderFormHelper(field)}
            </Form.Item>
            {field?.under}
          </Form.Item>
        ))}
      </Form.Item>
    );
  }, [fields, renderFormHelper]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Form
      form={form}
      name="auth_form"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      onValuesChange={onValuesChange}
      requiredMark={false}
      className={cn(
        "h-full flex flex-col md:justify-start justify-between",
        formClassName
      )}
    >
      {renderFormLayout()}
      <Form.Item className="!mb-0">
        <KButton
          loading={submitLoading}
          className="w-full !h-[38px] !rounded-full"
          type="primary"
          htmlType="submit"
        >
          {submitLabel}
        </KButton>
      </Form.Item>
    </Form>
  );
}
