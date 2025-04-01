"use client";

import { Anchor, FormInstance } from "antd";
import React, { FC, useEffect, useState } from "react";
import MainFormLayout from "./components/MainFormLayout";
import { FormMainLayoutType } from "@/components/molecules/FormHelper";
import styles from "./styles.module.scss";

type Props = {
  fields: FormMainLayoutType[];
  form?: FormInstance;
  isHiddenAnchor?: boolean;
};

const FormLayout: FC<Props> = ({ fields, form, isHiddenAnchor = false }) => {
  const [activeAnchor, setActiveAnchor] = useState<string>();

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement;
      const scrollPosition = container.scrollTop + 350;
      const sections = fields.map((field) => ({
        id: field.id.toString(),
        element: document.getElementById(field.id.toString()),
      }));

      for (const section of sections) {
        const element = section.element;
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveAnchor(`#${section.id}`);
            break;
          }
        }
      }
    };

    const scrollContainer = document.querySelector(".ant-drawer-body");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      setTimeout(() => {
        const event = new Event("scroll");
        Object.defineProperty(event, "target", { value: scrollContainer });
        handleScroll(event);
      }, 100);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [fields]);

  const anchorItems = fields.map((field) => ({
    key: field.id,
    href: `#${field.id}`,
    title: field.title,
    hidden: field.hidden,
  }));

  return (
    <div className="flex gap-[65px]">
      {!isHiddenAnchor && (
        <div className="sticky top-0 h-fit">
          <Anchor
            items={anchorItems.filter((item) => !item.hidden)}
            affix={false}
            bounds={50}
            targetOffset={80}
            getCurrentAnchor={() => activeAnchor || ""}
            onChange={(currentAnchor) => setActiveAnchor(currentAnchor)}
            onClick={(e) => {
              e.preventDefault();
              const targetElement = document.getElementById(
                e.currentTarget.getAttribute("href")?.replace("#", "") || ""
              );
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={styles.anchor}
          />
        </div>
      )}

      <div className="flex flex-col gap-5 w-[520px]">
        {fields.map((record, index) => (
          <div id={record.id.toString()} key={`main-form-layout-item-${index}`}>
            <MainFormLayout layout={record} form={form} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormLayout;
