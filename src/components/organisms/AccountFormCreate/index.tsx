import { Form } from "antd";
import FormLayout from "../FormLayout";
import useCreateAccountLayout from "@/hooks/users/useCreateAccountLayout";
import { KButton, KText } from "@/components/atoms";

const AccountFormCreate = ({
  phone,
  handleSubmit,
  loading,
}: {
  phone: string;
  handleSubmit: (values: any) => void;
  loading: boolean;
}) => {
  const [form] = Form.useForm();

  const { accountFormLayout } = useCreateAccountLayout();

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleSubmit}
      initialValues={{
        isBusiness: "false",
        isDisable: "true",
        phoneNumber: phone,
      }}
      className="w-fit !bg-[#fafafa] !p-6 !rounded-lg !mb-5"
    >
      <KText className="s5-semibold text-neutral8">Tạo tài khoản</KText>
      <FormLayout
        fields={accountFormLayout as []}
        form={form}
        isHiddenAnchor={true}
      />
      <KButton
        type="primary"
        className="!h-[38px] !rounded-sm"
        onClick={form.submit}
        loading={loading}
      >
        Tạo tài khoản
      </KButton>
    </Form>
  );
};

export default AccountFormCreate;
