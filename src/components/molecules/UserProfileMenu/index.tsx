"use client";

import { Avatar, Popover, Space } from "antd";
import React from "react";
import { CaretDown, User } from "@phosphor-icons/react";
import UserActionMenu from "../UserActionMenu";
import { KText } from "@/components/atoms";
import {
  AVATAR_ICON_SIZE_DEFAULT,
  AVATAR_SIZE_DEFAULT,
  ICON_SIZE_DEFAULT,
  ICON_WEIGHT_DEFAULT,
  SPACE_SIZE_DEFAULT,
} from "@/constants";
import { useAuth } from "@/contexts/AuthContext";

export default function UserProfileMenu() {
  const { adminProfile } = useAuth();

  return (
    <Popover content={UserActionMenu} trigger="click">
      <Space className="cursor-pointer" size={SPACE_SIZE_DEFAULT}>
        <Avatar
          size={AVATAR_SIZE_DEFAULT}
          icon={
            <User
              size={AVATAR_ICON_SIZE_DEFAULT}
              weight={ICON_WEIGHT_DEFAULT}
            />
          }
          src={adminProfile?.viewableAvatar}
        />
        <div className="flex flex-col">
          <KText className="sbody-semibold">{adminProfile?.fullName}</KText>
          <KText className="sbody-code">{adminProfile?.role}</KText>
        </div>
        <CaretDown size={ICON_SIZE_DEFAULT} weight={ICON_WEIGHT_DEFAULT} />
      </Space>
    </Popover>
  );
}
