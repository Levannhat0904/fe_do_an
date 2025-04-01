import SLoading from "@/components/atoms/KLoading";
import dynamic from "next/dynamic";

const LoginPageContent = dynamic(() => import("@/components/pages/loginPage"), {
  ssr: false,
  loading: () => <SLoading />,
});

export default function Login() {
  return <LoginPageContent />;
}
