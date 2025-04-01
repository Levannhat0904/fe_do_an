"use client";

import React, { useState } from "react";
import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { FunnelSimple } from "@phosphor-icons/react";
import { colors, STagProps } from "@/constants";

const KTag: React.FC<STagProps> = ({ tags, onRemoveTag }) => {
  return (
    <div className="flex">
      {tags.map(({ key, label, value }, index) => (
        <Tag
          key={key}
          className=" gap-2 items-center !rounded-xl  !bg-[#F0F0F0]"
        >
          <div className="px-3 py-1 bg-[#F0F0F0] flex items-center gap-2">
            {index === 0 && <FunnelSimple size={20} color={colors.black} />}
            <span className="sbody-code">
              {label}: {value}
            </span>
            <CloseOutlined
              onClick={() => onRemoveTag(key)}
              className="cursor-pointer text-base"
            />
          </div>
        </Tag>
      ))}
    </div>
  );
};

export default KTag;
