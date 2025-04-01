import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DEBOUNCE_TIME_700, PLACEHOLDER_DEFAULT } from "@/constants";

interface KSearchBoxProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  debounceTime?: number;
  className?: string;
  suffix?: any;
}

const KSearchBox: React.FC<KSearchBoxProps> = ({
  placeholder = PLACEHOLDER_DEFAULT,
  onSearch,
  debounceTime = DEBOUNCE_TIME_700,
  className,
  suffix,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleDebounceSearch = setTimeout(() => {
      onSearch?.(searchTerm.trim());
    }, debounceTime);

    return () => {
      clearTimeout(handleDebounceSearch);
    };
  }, [searchTerm, debounceTime, onSearch]);

  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onPressEnter={() => onSearch?.(searchTerm)}
      className={`rounded-lg ${className}`}
      suffix={suffix}
    />
  );
};

export default KSearchBox;
