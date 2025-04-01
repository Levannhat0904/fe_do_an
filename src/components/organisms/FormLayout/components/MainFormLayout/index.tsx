import { KBox } from "@/components/atoms";
import FormHelper, {
  FormLayoutType,
  FormMainLayoutType,
} from "@/components/molecules/FormHelper";
import { FormLayoutEnum, FormMainLayoutEnum } from "@/constants";
import { cn } from "@/utils";
import { Col, Form, FormInstance, Row } from "antd";
import React, { FC, useCallback } from "react";

type Props = {
  layout: FormMainLayoutType;
  form?: FormInstance;
};

// Component con để xử lý watch
const FormLayoutChild = ({ record, form, colSpan }: any) => {
  const hiddenValue = Form.useWatch(record?.hide?.when, form);
  const isHidden = record?.hidden;

  return (
    <Col
      key={record.name}
      xs={24}
      md={colSpan}
      className={cn(
        "!px-1",
        isHidden || hiddenValue === record?.hide?.is ? "!hidden" : ""
      )}
    >
      <FormHelper key={record?.name} form={form} {...record} />
    </Col>
  );
};

const MainFormLayout: FC<Props> = ({ layout, form }) => {
  const isHidden = Form.useWatch(layout?.hidden?.is, form);

  const renderLayout = useCallback(
    (layout: FormLayoutType) => {
      if (layout.hidden) return null;
      switch (layout.type) {
        case FormLayoutEnum.grid:
          return (
            <Row gutter={[20, 20]} className="mb-5">
              {layout.children.map((record: any) => (
                <FormLayoutChild
                  key={record.name}
                  record={record}
                  form={form}
                  colSpan={24 / (layout?.grid || 1)}
                />
              ))}
            </Row>
          );
        case FormLayoutEnum.component:
          return !Array.isArray(layout.children) && layout.children;
        default:
          break;
      }
    },
    [form]
  );

  const renderMainLayout = useCallback(() => {
    switch (layout.type) {
      case FormMainLayoutEnum.box:
        return (
          <KBox
            {...layout}
            hidden={typeof isHidden === "boolean" ? isHidden : false}
          >
            {layout.children.map(renderLayout)}
          </KBox>
        );

      default:
        break;
    }
  }, [isHidden, layout, renderLayout]);

  return renderMainLayout();
};

export default MainFormLayout;
