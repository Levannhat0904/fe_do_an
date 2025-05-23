// Re-export formatters from utils
export { formatDate, formatCurrency, formatDateShort, formatDateTime } from "@/utils/formatters";

// Status mapping without JSX - will be used with StatusTag component  
export const getRoomStatusType = (status: string): string => {
  switch (status) {
    case "available":
      return "available";
    case "full":
      return "full";
    case "maintenance":
      return "maintenance";
    default:
      return status;
  }
}; 