import React from 'react';

interface FormattedCurrencyProps {
  amount: number | undefined;
  suffix?: string;
  prefix?: string;
}

const FormattedCurrency: React.FC<FormattedCurrencyProps> = ({ 
  amount, 
  suffix = " VNĐ",
  prefix = ""
}) => {
  if (amount === undefined) return <>N/A</>;
  
  const formatted = new Intl.NumberFormat("vi-VN").format(amount);
  return <>{prefix}{formatted}{suffix}</>;
};

export default FormattedCurrency; 