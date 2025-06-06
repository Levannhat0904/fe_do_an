export enum Routers {
  home = "/",
  login = "/dang-nhap",
  forgotPassword = "/quen-mat-khau",
  resetPassword = "/dat-lai-mat-khau",
  register = "/dang-ky",
}
export enum RoutersStudent {
  home = "/sinh-vien",
  login = "/dang-nhap",
  forgotPassword = "/quen-mat-khau",
}
export enum UserType {
  admin = "admin",
  student = "student",
  super_admin = "super_admin",
}
export enum InputType {
  text = "text",
  password = "password",
}

export enum IconWeightType {
  bold = "bold",
  duotone = "duotone",
  fill = "fill",
  light = "light",
  regular = "regular",
  thin = "thin",
}

export enum FormHelperEnum {
  input = "input",
  select = "select",
  upload = "upload",
  date = "date",
  switch = "switch",
  tab = "tab",
  autoComplete = "autoComplete",
  radioGroupButton = "radioGroupButton",
}

export enum FormRuleEnum {
  required = "required",
  pattern = "pattern",
  email = "email",
  max = "max",
  min = "min",
  whitespace = "whitespace",
  validator = "validator",
}

export enum FormLayoutEnum {
  grid = "grid",
  component = "component",
}

export enum FormMainLayoutEnum {
  box = "box",
  collapse = "collapse",
}

export enum StatusEnum {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
  Completed = "completed",
  Canceled = "canceled",
  Processing = "processing",
  Success = "success",
  Assigned = "assigned",
  Available = "available",
  Maintenance = "maintenance",
  WaitingForApproval = "waiting_for_approval",
}

export enum DrawerEnum {
  filter = "filter",
}

export enum NavigationButtonType {
  Prev = "prev",
  Next = "next",
  Page = "page",
  JumpPrev = "jump-prev",
  JumpNext = "jump-next",
}

export enum DrawerPlacementEnum {
  right = "right",
  left = "left",
}

export enum FilterTypeEnum {
  dropDown = "dropDown",
  select = "select",
  date = "date",
}

export enum SearchTypeEnum {
  server = "server",
  client = "client",
}

export enum FilterTypeEnum {
  multiple = "multiple",
  single = "single",
}

export enum ValueTypeEnum {
  string = "string",
  number = "number",
  boolean = "boolean",
  dateRange = "dateRange",
}

export enum InformationItemTypeEnum {
  number = "number",
  string = "string",
  image = "image",
  file = "file",
}

export enum CreateOrderStepEnum {
  INFORMATION = 1,
  SUMMARY = 2,
}

export const enum RadioOptionTypeEnum {
  DEFAULT = "default",
  BUTTON = "button",
}

export enum SuffixType {
  select = "select",
}

export enum AttachmentTypeEnum {
  video = "video",
  image = "image",
}

export enum EditSearchTypeEnum {
  options = "options",
}

export enum IconWeight {
  bold = "bold",
  duotone = "duotone",
  fill = "fill",
  light = "light",
  regular = "regular",
  thin = "thin",
}
export enum userRole {
  super_admin = "super_admin",
  admin = "admin",
  student = "student",
  undefined = "undefined",
}
export enum StudentStatusEnum {
  active = "active",
  inactive = "inactive",
  pending = "pending",
  blocked = "blocked",
}
