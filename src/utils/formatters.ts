import dayjs from "dayjs";

export const formatDate = (dateString: string | Date | undefined, format = "DD/MM/YYYY HH:mm"): string => {
  if (!dateString) return "N/A";
  return dayjs(dateString).format(format);
};

export const formatCurrency = (amount: number | undefined, suffix = " VNĐ"): string => {
  if (amount === undefined) return "N/A";
  return new Intl.NumberFormat("vi-VN").format(amount) + suffix;
};

export const formatDateShort = (dateString: string | Date | undefined): string => {
  return formatDate(dateString, "DD/MM/YYYY");
};

export const formatDateTime = (dateString: string | Date | undefined): string => {
  return formatDate(dateString, "DD/MM/YYYY HH:mm:ss");
}; 