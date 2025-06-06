import SLoading from "@/components/atoms/KLoading";
import dynamic from "next/dynamic";

const ResetPasswordPageContent = dynamic(
  () => import("@/components/pages/resetPasswordPage"),
  {
    ssr: false,
    loading: () => <SLoading />,
  }
);

export default function ResetPassword() {
  return <ResetPasswordPageContent />;
}
