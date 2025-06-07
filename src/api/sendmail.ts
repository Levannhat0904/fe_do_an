import { publicAxios } from "./axiosClient";

export const sendMail = async (to: {
  Email: string,
  Name: string
}, subject: string, text: string, html: string) => {
  const response = await publicAxios.post('/api/send-mail/contact', { to, subject, text, html });
  return response.data;
};
