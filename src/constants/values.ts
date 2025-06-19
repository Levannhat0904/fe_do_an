import { colors } from "./colors";
import {
  IconWeight,
} from "./enums";

export const DEFAULT_EMPTY_OPTIONS = [];

export const API_URL = "http://localhost:3000";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const COLLAPSE_ICON_PROPS = {
  "size": 20,
  "weight": IconWeight.bold,
  "rotate": 90,
  "fill": colors.black
}

// Fake data

export const FACULTY_OPTIONS = [
  { label: "Công nghệ thông tin", value: "Công nghệ thông tin" },
  { label: "Kinh tế", value: "Kinh tế" },
  { label: "Khoa học xã hội", value: "Khoa học xã hội" },
];

export const MAJOR_OPTIONS: Record<string, { label: string; value: string }[]> = {
  "Công nghệ thông tin": [
    { label: "Khoa học máy tính", value: "Khoa học máy tính" },
    { label: "Công nghệ phần mềm", value: "Công nghệ phần mềm" },
    { label: "Hệ thống thông tin", value: "Hệ thống thông tin" },
  ],
  "Kinh tế": [
    { label: "Tài chính", value: "Tài chính" },
    { label: "Kế toán", value: "Kế toán" },
    { label: "Quản trị kinh doanh", value: "Quản trị kinh doanh" },
  ],
  "Khoa học xã hội": [
    { label: "Tâm lý học", value: "Tâm lý học" },
    { label: "Xã hội học", value: "Xã hội học" },
    { label: "Triết học", value: "Triết học" },
  ],
};


export const widthSuffixesSelect = 166;

export const DEBOUNCE_TIME_700 = 700;
export const PLACEHOLDER_DEFAULT = "Tìm kiếm";
export const DEFAULT_PAGE_SIZE = 10;