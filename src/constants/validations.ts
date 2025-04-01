export const phoneRegex =
  /^(0?)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-6789])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;

export const licensePlateRegex = /^(XECHUACOBIEN\d+|\d{2}[A-Z]{1,2}\d{4,5})$/;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const positiveNumberRegex = /^[1-9]\d*$/;

export const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/

export const loadVolumeRegex = /^[0-9]+$/;