export const ERROR_MESSAGES: Record<
  string,
  { errorCode: string; message?: string; description?: string }
> = {
  DEFAULT: {
    errorCode: "DEFAULT",
    message: "Đã xảy ra lỗi",
    description:
      "Một lỗi không xác định đã xảy ra. Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ nếu vấn đề vẫn tiếp diễn.",
  },
  FAIL_VALIDATION: {
    errorCode: "FAIL_VALIDATION",
    message: "Xác nhận thông tin",
    description:
      "Vui lòng kiểm tra và xác nhận lại thông tin đã nhập. Đảm bảo tất cả các trường được điền chính xác theo yêu cầu.",
  },
  BAD_AUTHENTICATION: {
    errorCode: "BAD_AUTHENTICATION",
    message: "Đăng nhập không thành công",
    description:
      "Số điện thoại hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin đăng nhập của bạn.",
  },
  RESOURCE_NOT_FOUND: {
    errorCode: "RESOURCE_NOT_FOUND",
    message: "Không tìm thấy tài nguyên",
    description: "Không tìm thấy tài nguyên yêu cầu",
  },
};
