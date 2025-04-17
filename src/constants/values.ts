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
  { label: "Công nghệ thông tin", value: "cntt" },
  { label: "Kinh tế", value: "kinhte" },
  { label: "Khoa học xã hội", value: "khxh" },
];

export const MAJOR_OPTIONS: Record<string, { label: string; value: string }[]> = {
  cntt: [
    { label: "Khoa học máy tính", value: "khmt" },
    { label: "Công nghệ phần mềm", value: "cnpm" },
    { label: "Hệ thống thông tin", value: "httt" },
  ],
  kinhte: [
    { label: "Tài chính", value: "tc" },
    { label: "Kế toán", value: "kt" },
    { label: "Quản trị kinh doanh", value: "qtkd" },
  ],
  khxh: [
    { label: "Tâm lý học", value: "tlh" },
    { label: "Xã hội học", value: "xhh" },
    { label: "Triết học", value: "th" },
  ],
};


export const widthSuffixesSelect = 166;

export const DEBOUNCE_TIME_700 = 700;
export const PLACEHOLDER_DEFAULT = "Tìm kiếm";