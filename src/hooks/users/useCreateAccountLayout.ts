import {
  FormHelperEnum,
  FormLayoutEnum,
  FormMainLayoutEnum,
  phoneRegex,
} from "@/constants";

const useCreateAccountLayout = () => {
  const accountFormLayout = [
    {
      id: 1,
      type: FormMainLayoutEnum.box,
      title: `Tạo tài khoản`,
      hiddenTitle: true,
      children: [
        {
          type: FormLayoutEnum.grid,
          grid: 1,
          children: [

            {
              name: "isBusiness",
              type: FormHelperEnum.radioGroupButton,
              className: "!flex !items-center",
              options: [
                {
                  label: "Cá nhân",
                  value: "false",
                },
                {
                  label: "Doanh nghiệp",
                  value: "true",
                },
              ],
            },
            {
              name: "isDisable",
              value: "true",
              hidden: "true"
            },
            {
              label: `Tên doanh nghiệp`,
              name: "organizationName",
              type: FormHelperEnum.input,
              placeholder: `Nhập tên doanh nghiệp`,
              rules: [
                {
                  type: "max",
                  max: 255,
                  message: `Tên doanh nghiệp không được quá 255 ký tự!`,
                },
                {
                  type: "required",
                  message: `Vui lòng nhập tên doanh nghiệp`,
                },
              ],
              hide: {
                when: "isBusiness",
                is: "false",
              },
            },
            {
              label: `Mã số thuế`,
              name: "organizationTaxCode",
              type: FormHelperEnum.input,
              placeholder: `Nhập mã số thuế`,
              rules: [
                {
                  type: "max",
                  max: 255,
                  message: `Mã số thuế không được quá 255 ký tự!`,
                },
                {
                  type: "required",
                  message: `Vui lòng nhập mã số thuế`,
                },
              ],
              hide: {
                when: "isBusiness",
                is: "false",
              },
            },
            {
              label: `Họ và tên`,
              name: "fullName",
              type: FormHelperEnum.input,
              placeholder: `Nhập họ và tên`,
              rules: [
                {
                  type: "max",
                  max: 255,
                  message: `Họ và tên không được quá 255 ký tự!`,
                },
                {
                  type: "required",
                  message: `Vui lòng nhập họ và tên`,
                },
              ],
            },
            {
              label: "Số điện thoại",
              name: "phoneNumber",
              disabled: {
                when: "isDisable",
                is: "true",
              },
              type: FormHelperEnum.input,
              placeholder: "Nhập số điện thoại",
              rules: [
                {
                  type: "required",
                  message: "Vui lòng nhập số điện thoại",
                },
                {
                  type: "pattern",
                  pattern: phoneRegex,
                  message: "Số điện thoại sai định dạng!",
                },
              ],
            },
            {
              label: "Mật khẩu",
              name: "password",
              type: FormHelperEnum.input,
              placeholder: "Nhập mật khẩu",
              rules: [
                {
                  type: "min",
                  min: 8,
                  message: "Mật khẩu đăng nhập phải có ít nhất 8 ký tự!",
                },
                {
                  type: "required",
                  message: "Vui lòng nhập mật khẩu đăng nhập",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return {
    accountFormLayout,
  };
};

export default useCreateAccountLayout;
