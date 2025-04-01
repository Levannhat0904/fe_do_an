import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterTypeEnum, ValueTypeEnum } from "@/constants";

type FilterType = FilterTypeEnum;
type ValueType = ValueTypeEnum

interface FilterConfig {
  type?: FilterType;
  valueType?: ValueType;
}

interface UseFilterProps {
  defaultValues?: Record<string, any>;
  config?: Record<string, FilterConfig>;
}

export const useFilter = ({
  defaultValues = {},
  config = {},
}: UseFilterProps = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse value based on valueType
  const parseValue = useCallback((value: string, valueType?: ValueType) => {
    switch (valueType) {
      case ValueTypeEnum.number:
        return Number(value);
      case ValueTypeEnum.boolean:
        return value === 'true';
      case ValueTypeEnum.dateRange:
        return value;
      default:
        return value;
    }
  }, []);

  // Parse array of values
  const parseArrayValue = useCallback(
    (values: string[], valueType?: ValueType) => {
      return values.map((value) => parseValue(value, valueType));
    },
    [parseValue]
  );

  // Get current filters from URL
  const filters = useMemo(() => {
    const currentFilters: Record<string, any> = { ...defaultValues };
    const entries = Array.from(searchParams.entries());

    // Group các params có cùng key
    const groupedParams: Record<string, string[]> = {};
    entries.forEach(([key, value]) => {
      // Xử lý date range params (createdAt[0], createdAt[1])
      const dateRangeMatch = key.match(/^(.+)\[(\d+)\]$/);
      if (dateRangeMatch) {
        const [, baseKey, index] = dateRangeMatch;
        if (!groupedParams[baseKey]) {
          groupedParams[baseKey] = [];
        }
        groupedParams[baseKey][Number(index)] = value;
      } else {
        if (!groupedParams[key]) {
          groupedParams[key] = [];
        }
        groupedParams[key].push(value);
      }
    });

    // Parse các giá trị theo config
    Object.entries(groupedParams).forEach(([key, values]) => {
      const filterConfig = config[key];

      if (filterConfig?.valueType === ValueTypeEnum.dateRange) {
        // Đảm bảo có đủ 2 giá trị cho date range
        if (values.length === 2) {
          currentFilters[key] = values;
        }
      } else if (filterConfig?.type === FilterTypeEnum.multiple) {
        currentFilters[key] = parseArrayValue(values, filterConfig.valueType);
      } else {
        currentFilters[key] = parseValue(values[0], filterConfig?.valueType);
      }
    });

    return currentFilters;
  }, [searchParams, defaultValues, config, parseValue, parseArrayValue]);

  // Update filters
  const setFilter = useCallback((key: string, value: any) => {
    const params = new URLSearchParams(searchParams.toString());
    const filterConfig = config[key];

    // Xóa tất cả params hiện tại của key này
    Array.from(params.keys())
      .filter(paramKey => paramKey === key || paramKey.startsWith(`${key}[`))
      .forEach(paramKey => params.delete(paramKey));

    if (!value) {
      // Không làm gì nếu value là null/undefined
    } else if (filterConfig?.valueType === ValueTypeEnum.dateRange && Array.isArray(value)) {
      // Set date range values với index
      value.forEach((date, index) => {
        params.set(`${key}[${index}]`, date);
      });
    } else if (filterConfig?.type === FilterTypeEnum.multiple && Array.isArray(value)) {
      // Set multiple values
      value.forEach(v => params.append(key, String(v)));
    } else {
      // Set single value
      params.set(key, String(value));
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams, config]);

  // Reset all filters to default values
  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return {
    filters,
    setFilter,
    resetFilters,
  };
};
