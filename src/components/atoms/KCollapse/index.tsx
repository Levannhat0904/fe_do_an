"use client";
import React, { FC, ReactNode } from "react";
import { Collapse, CollapseProps } from "antd";
import { CaretDown } from "@phosphor-icons/react";

interface Props extends CollapseProps {
  panelKey: string;
  label: string | ReactNode;
  children: React.ReactNode;
}

const KCollapse: FC<Props> = ({ label, children, panelKey, ...rest }) => {
  return (
    <Collapse
      {...rest}
      ghost
      expandIcon={({ isActive }) => (
        <CaretDown
          className={`transform transition-transform ${
            isActive ? "rotate-180" : ""
          }`}
        />
      )}
      expandIconPosition="end"
    >
      <Collapse.Panel
        header={
          typeof label === "string" ? (
            <span className="s5-semibold text-sdark1">{label}</span>
          ) : (
            label
          )
        }
        key={panelKey}
      >
        {children}
      </Collapse.Panel>
    </Collapse>
  );
};

export default KCollapse;
