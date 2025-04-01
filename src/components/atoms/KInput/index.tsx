import { InputType, TOption } from "@/constants";
import { cn } from "@/utils";
import { Form, FormInstance, Input, InputProps } from "antd";
import React, { ReactNode, useCallback } from "react";
import styles from "./styles.module.scss";
import SSuffixSelect from "../KSuffixSelect";

export enum SuffixType {
  select = "select",
}

type Props = {
  inputType?: InputType;
  form?: FormInstance;
  suffixIcon?: (form?: FormInstance) => ReactNode;
  suffixes?: {
    type: SuffixType;
    options?: TOption[];
    placeholder?: string;
    name: string;
  };
  onBlur?: (form?: FormInstance) => void;
} & InputProps;

export default function KInput(props: Props) {
  const {
    className,
    inputType = InputType.text,
    suffixes,
    suffixIcon,
    suffix,
    form,
    onBlur,
    ...rest
  } = props;

  const suffixValue = props.form?.getFieldValue(suffixes?.name);

  const renderSuffix = useCallback(() => {
    if (suffixes) {
      switch (suffixes.type) {
        case SuffixType.select:
          return (
            <Form.Item noStyle name={suffixes?.name}>
              <SSuffixSelect
                value={suffixValue}
                onSelect={(value) =>
                  props.form?.setFieldValue(suffixes?.name, value)
                }
                {...suffixes}
              />
            </Form.Item>
          );

        default:
          return <></>;
      }
    }

    return suffixIcon?.(props.form);
  }, [props.form, suffixIcon, suffixes, suffixValue]);

  const renderInput = () => {
    switch (inputType) {
      case InputType.text:
        return (
          <Input
            className={cn(
              "!rounded-full !sbody-code",
              styles.container,
              className
            )}
            autoComplete="off"
            onBlur={() => onBlur?.(props.form)}
            suffix={suffix || renderSuffix()}
            {...rest}
          />
        );
      case InputType.password:
        return (
          <Input.Password
            className={cn(
              "!rounded-full !sbody-code",
              styles.container,
              className
            )}
            autoComplete="off"
            {...rest}
          />
        );
    }
  };

  return renderInput();
}
