import { DEFAULT_EMPTY_STRING } from "@/constants";
import dayjs from "dayjs";

export const DAY_MONTH_YEAR_FORMAT = "DD/MM/YYYY";

export const DAY_MONTH_YEAR_HOUR_MINUTE_FORMAT = "DD/MM/YYYY HH:mm";

export const HOUR_MINUTE_DAY_MONTH_YEAR_FORMAT = "HH:mm DD/MM/YYYY";

export const FORMAT_YEAR_OPTION = "YYYY";

export const MANUFACTURE_YEAR_MIN_DATE = dayjs().subtract(25, "year");

export const MANUFACTURE_YEAR_MAX_DATE = dayjs();

export const DEFAULT_VALUE_DATE_TIME_PICKER = dayjs("00:00", "HH:mm");

export const formatDayMonthYear = (timestamp?: string | number) => {
  return dayjs(Number(timestamp)).format(DAY_MONTH_YEAR_FORMAT) || DEFAULT_EMPTY_STRING;
}

export const formatDayMonthYearHourMinute = (timestamp: number) =>
  dayjs(Number(timestamp)).format(DAY_MONTH_YEAR_HOUR_MINUTE_FORMAT);
export const formatYear = (year: number | string) => {
  return dayjs(year.toString(), FORMAT_YEAR_OPTION)
};
export const formatStartOfDayToTimestamp = (date: Date) => {
  return dayjs(date).startOf("day").toDate().getTime().toString();
};

export const formatEndOfDayToTimestamp = (date: Date) => {
  return dayjs(date).endOf("day").toDate().getTime().toString();
};

export const formatGetYear = (date: number) => {
  return dayjs(date).year();
};

export const formatGetMonth = (date: number) => {
  return dayjs(date).month() + 1;
};

export const formatGetDay = (date: number) => {
  return dayjs(date).date();
};

export const formatGetTimestamp = (date: string) => {
  return dayjs(date).valueOf().toString();
};

export const formatRegistrationDate = (date: string) => {
  return dayjs(date).format(DAY_MONTH_YEAR_HOUR_MINUTE_FORMAT);
};

export const formatHourMinuteDayMonthYear = (timestamp: number) => {
  return dayjs(Number(timestamp)).format(HOUR_MINUTE_DAY_MONTH_YEAR_FORMAT);
};

export const addYearToDate = (
  date: any,
  year: number,
  value: "year" | "month" | "day"
) => {
  return dayjs(date).add(year, "year")[value]();
};
