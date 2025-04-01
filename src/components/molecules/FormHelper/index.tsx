import { Form } from "antd";
import React, { ReactNode, useMemo } from "react";
import { FormInstance, Rule } from "antd/es/form";
import {
  FormHelperEnum,
  FormRuleEnum,
  SearchTypeEnum,
  SuffixType,
  TOption,
} from "@/constants";
import { cn } from "@/utils";
import {
  KDatePickerField,
  KInput,
  KRadioGroupButton,
  KSelectField,
  KUploadField,
} from "@/components/atoms";
import KAutoComplete from "@/components/atoms/KAutoComplete";

export type FormRuleType = {
  type: string;
  pattern?: any;
  message?: string;
  max?: number;
  min?: number;
  whitespace?: boolean;
  validator?: any;
};

export type OptionType = {
  label: string;
  value: string;
};

export type FormHelperType = {
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  rules?: FormRuleType[];
  options?: OptionType[];
  help?: string;
};

export type FormLayoutType = {
  type: string;
  grid?: number;
  hidden?: boolean;
  children: FormHelperType[];
};

export type FormMainLayoutType = {
  id: number;
  type: string;
  title: string | React.ReactNode;
  alternativeTitle?: string | React.ReactNode;
  className?: string;
  subTitle?: string | React.ReactNode;
  rightLayout?: React.ReactNode;
  children: FormLayoutType[];
  hidden?: {
    is: string;
    when: any;
  };
  includesActions?: boolean;
  closeFormLabel?: string | React.ReactNode;
  submitFormLabel?: string | React.ReactNode;
};

export type FormConditionType = {
  when: string;
  is: any;
  includes?: any;
};

type Props = FormHelperType & {
  multiple?: boolean;
  form?: FormInstance;
  disabled?: FormConditionType;
  hide?: FormConditionType;
  hidden?: boolean;
  fieldProps?: any;
  help?: string;
  hideHelpWhenError?: boolean;
  rightLabelLayout?: ReactNode;
  isHelpCenter?: boolean;
  hiddenLabel?: boolean;
  isDefault?: boolean;
  fetchOptions?: any;
  searchConfig?: {
    type: SearchTypeEnum;
    searchKey: string;
  };
  onLoadMore?: () => void;
  className?: string;
  suffixes?: {
    type: SuffixType;
    options?: TOption[];
    placeholder?: string;
    name: string;
  };
};

function FormHelper(props: Props) {
  const {
    label,
    name,
    type,
    placeholder,
    rules,
    options,
    form,
    disabled,
    hide,
    hidden,
    fieldProps,
    help,
    hideHelpWhenError,
    rightLabelLayout,
    isHelpCenter,
    hiddenLabel,
    fetchOptions,
    searchConfig,
    suffixes,
    onLoadMore,
    ...rest
  } = props;
  const disabledValue = Form.useWatch(disabled?.when);
  const hiddenValue = Form.useWatch(hide?.when);
  const isError = form
    ?.getFieldsError()
    ?.some(({ errors }) => errors.length > 0);

  const newDisabled = useMemo(() => {
    if (
      disabledValue === disabled?.is ||
      disabled?.includes?.includes?.(disabledValue)
    ) {
      return true;
    }

    return false;
  }, [disabled, disabledValue]);
  const newHidden = useMemo(() => {
    if (hide && hiddenValue === hide?.is) {
      return true;
    }

    if (hidden) {
      return hidden;
    }

    return false;
  }, [hidden, hiddenValue, hide]);

  const formatRules = useMemo(() => {
    const newRules: Rule[] = [];

    if (newHidden) {
      return [];
    }

    rules?.forEach((record) => {
      switch (record.type) {
        case FormRuleEnum.required:
          if (type === FormHelperEnum.input) {
            newRules.push({
              validator: async (_: any, value: string) => {
                if (!value || !value.trim()) {
                  return Promise.reject(
                    record?.message || `${label} là trường bắt buộc`
                  );
                }
                const patternRule = rules.find(
                  (r) => r.type === FormRuleEnum.pattern
                );
                if (patternRule?.pattern && !patternRule.pattern.test(value)) {
                  return Promise.reject(patternRule.message);
                }
                return Promise.resolve();
              },
            });
          } else {
            newRules.push({
              required: true,
              message: record?.message || `${label} là trường bắt buộc`,
            });
          }
          break;
        case FormRuleEnum.email:
          newRules.push({
            type: FormRuleEnum.email,
            message: record?.message,
          });
          break;

        case FormRuleEnum.max:
          newRules.push({
            max: record?.max,
            message: record?.message,
          });
          break;
        case FormRuleEnum.min:
          newRules.push({
            min: record?.min,
            message: record?.message,
          });
          break;
        case FormRuleEnum.validator:
          newRules.push({
            validator: record.validator,
          });
          break;
        default:
          break;
      }
    });

    return newRules;
  }, [label, rules, newHidden, type]);

  const formatHelp = useMemo(() => {
    if (hideHelpWhenError && isError) {
      return undefined;
    }

    return help;
  }, [help, hideHelpWhenError, isError]);

  const renderLayout = () => {
    switch (type) {
      case FormHelperEnum.input:
        return (
          <KInput
            placeholder={placeholder}
            disabled={newDisabled}
            form={form as any}
            className="!rounded-lg border-neutral4 !h-12"
            suffixes={suffixes}
            {...rest}
          />
        );
      case FormHelperEnum.select:
        return (
          <KSelectField
            name={name}
            placeholder={placeholder}
            options={options}
            form={form}
            disabled={newDisabled}
            fetchOptions={(value) => fetchOptions?.(value)}
            onLoadMore={onLoadMore}
            {...rest}
          />
        );
      case FormHelperEnum.date:
        return (
          <KDatePickerField
            name={name}
            placeholder={placeholder}
            disabled={newDisabled}
            {...rest}
          />
        );
      case FormHelperEnum.upload:
        return (
          <Form.Item noStyle shouldUpdate dependencies={[name]}>
            {(fieldActions: FormInstance) => (
              <KUploadField
                name={name}
                fieldActions={fieldActions}
                {...rest}
                {...fieldProps}
              />
            )}
          </Form.Item>
        );
      case FormHelperEnum.radioGroupButton:
        return (
          <KRadioGroupButton
            options={options}
            name={name}
            className={rest.className}
            {...rest}
          />
        );
      case FormHelperEnum.autoComplete:
        return (
          <KAutoComplete
            name={name}
            className="!rounded-lg border-neutral4 !h-12"
            placeholder={placeholder}
            options={options}
            form={form}
            disabled={newDisabled}
            {...rest}
          />
        );
      default:
        break;
    }
  };

  return (
    <Form.Item
      name={name}
      label={
        !hiddenLabel && (
          <div className="w-[520px] flex items-center justify-between">
            <span className="sdescription-small text-neutral8">{label}</span>
            {rightLabelLayout}
          </div>
        )
      }
      rules={formatRules}
      className={cn(`!mb-0`)}
      hidden={newHidden}
      help={formatHelp}
    >
      {renderLayout()}
    </Form.Item>
  );
}

export default FormHelper;
