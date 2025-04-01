"use client";

import { Drawer, DrawerProps } from "antd";
import React from "react";
import styles from "./styles.module.scss";
import { X } from "@phosphor-icons/react";
import {
  colors,
  DrawerPlacementEnum,
  FORM_DRAWER_WIDTH,
  ICON_SIZE_DEFAULT,
  IconWeightType,
} from "@/constants";

interface KDrawerProps extends DrawerProps {
  onClose: () => void;
  open: boolean;
  destroyOnClose: boolean;
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  placement?: DrawerPlacementEnum;
}

const KDrawer = ({
  onClose,
  open,
  destroyOnClose,
  title,
  placement = DrawerPlacementEnum.right,
  children,
  ...rest
}: KDrawerProps) => {
  return (
    <Drawer
      placement={placement}
      onClose={onClose}
      open={open}
      destroyOnClose={destroyOnClose}
      width={FORM_DRAWER_WIDTH}
      title={title}
      className={styles.container}
      closeIcon={
        <X
          size={ICON_SIZE_DEFAULT}
          weight={IconWeightType.regular}
          color={colors.neutral8}
        />
      }
      {...rest}
    >
      {children}
    </Drawer>
  );
};

export default KDrawer;
