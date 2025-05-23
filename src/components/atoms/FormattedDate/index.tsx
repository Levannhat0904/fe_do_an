import React from 'react';
import dayjs from 'dayjs';

interface FormattedDateProps {
  date: string | Date | undefined;
  format?: string;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ 
  date, 
  format = "DD/MM/YYYY HH:mm"
}) => {
  if (!date) return <>N/A</>;
  
  return <>{dayjs(date).format(format)}</>;
};

export default FormattedDate; 