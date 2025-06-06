import SLoading from "@/components/atoms/KLoading";
import dynamic from "next/dynamic";

const ForgotPasswordPageContent = dynamic(
  () => import("@/components/pages/forgotPasswordPage"),
  {
    ssr: false,
    loading: () => <SLoading />,
  }
);

export default function ForgotPassword() {
  return <ForgotPasswordPageContent />;
}
