import { IconWeightType, StatusEnum, Routers } from "./enums";

export const DEFAULT_ERROR_MESSAGE = "Đã xảy ra lỗi!";

export const KTX_ADMIN_ACCESS_TOKEN = "ktx_admin_access_token";

export const KTX_ADMIN_REFRESH_TOKEN = "ktx_admin_refresh_token";

export const DEFAULT_PATH = "/";
export const NUMBER_REGEX = /^[0-9]+$/;

export const DEFAULT_VALUE = "DEFAULT";

export const DEFAULT_UNAUTHORIZED_CODE = 401;

export const DEFAULT_EMPTY_STRING = "--";

export const DEFAULT_NUMBER = 0;

export const AUTO_REDIRECT_TIME_COUNTDOWN = 10;

export const AVATAR_SIZE_DEFAULT = 32;

export const AVATAR_ICON_SIZE_DEFAULT = 18;

export const ICON_WEIGHT_DEFAULT = IconWeightType.bold;

export const SPACE_SIZE_DEFAULT = 17;

export const LOGO_URL = "/images/logo_utt.png";

export const LOGO_SIDEBAR_URL = "/images/logo_utt.png";

export const ICON_SIZE_SMALL = 16;

export const ICON_SIZE_MEDIUM = 20;

export const ICON_SIZE_LARGE = 32;

export const ICON_SIZE_DEFAULT = 24;
export const ICON_SIZE_SMALL_DEFAULT = 20;

export const MEDIUM_IMAGE_SIZE = 160;

export const DEFAULT_IMAGE_SIZE = 140;

export const AUTH_ROUTES = [
  Routers.login,
  Routers.forgotPassword,
  Routers.resetPassword,
  Routers.register,
];

export const SVG_NORMAL_OPACITY = 0.85;

export const ACCEPT_IMAGE_FILE = "image/png,image/jpeg,image/jpg";

export const PAGE_SIZE_OPTIONS = ["10", "20", "30", "50"];

export const DEFAULT_LIMIT = 10;

export const DEFAULT_OFFSET = 0;

export const LIMIT = "limit";

export const OFFSET = "offset";

export const FORM_DRAWER_WIDTH = 1226;

export const FILTER_DRAWER_WIDTH = 700;
export const EDIT_VERHICLE_DRAWER_WIDTH = 700;

export const DATE_FILTER_FORMAT = "YYYY-MM-DD HH:mm";

export const HOUR_MINUTE_DAY_MONTH_YEAR_FORMAT = "DD/MM/YYYY - HH:mm";

export const FORMAT_DATE_OPTION1 = "DD/MM/YYYY";

export const SHOW_TIME_FORMAT = "HH:mm";

export const SEARCH_DEBOUNCE_TIME = 500;

export const FALSE_STRING = "false";

export const createInformationSection = (data: any, fields: any) => {
  return fields.map(({ label, key, value, isDomain }: any) => {
    return {
      label,
      value: key ? data?.[key] || "N/A" : value,
      isDomain,
      valueClassName: "!s5-semibold",
    };
  });
};

export const badgeColor = {
  [StatusEnum.Pending]: "warning",
  [StatusEnum.Active]: "processing",
  [StatusEnum.Completed]: "success",
  [StatusEnum.Success]: "success",
  [StatusEnum.Inactive]: "error",
  [StatusEnum.Canceled]: "error",
  [StatusEnum.Processing]: "processing",
  [StatusEnum.Assigned]: "warning",
};

export const statusText = {
  [StatusEnum.Active]: "Đang hoạt động",
  [StatusEnum.Inactive]: "Ngừng hoạt động",
  [StatusEnum.Pending]: "Tiếp nhận",
  [StatusEnum.Completed]: "Đã hoàn thành",
  [StatusEnum.Success]: "Đã hoàn thành",
  [StatusEnum.Processing]: "Đang xử lý",
  [StatusEnum.Canceled]: "Đã hủy",
  [StatusEnum.Assigned]: "Đã tiếp nhận",
};

export const statusColor = {
  [StatusEnum.Active]: "text-ssuccess",
  [StatusEnum.Inactive]: "text-sdark4",
  [StatusEnum.Pending]: "text-primary6",
  [StatusEnum.Completed]: "text-ssuccess",
  [StatusEnum.Success]: "text-ssuccess",
  [StatusEnum.Processing]: "text-sprocessing",
  [StatusEnum.Canceled]: "text-sdanger",
  [StatusEnum.Assigned]: "text-primary6",
};
