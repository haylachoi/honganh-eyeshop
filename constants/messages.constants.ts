export const ERROR_MESSAGES = {
  NOT_FOUND: {
    ID: {
      SINGLE: "ID không tồn tại",
      MULTIPLE: "Một hoặc nhiều ID không tồn tại",
    },
    INFO: {
      SINGLE: "Thông tin không tồn tại",
      MULTIPLE: "Một hoặc nhiều thông tin không tồn tại",
    },
    SLUG: {
      SINGLE: "Slug không tồn tại",
      MULTIPLE: "Một hoặc nhiều slug không tồn tại",
    },
    // USER: {
    //   SINGLE: "Người dùng không tồn tại",
    //   MULTIPLE: "Một hoặc nhiều người dùng không tồn tại",
    // },
    // PRODUCT: {
    //   SINGLE: "Sản phẩm không tồn tại",
    //   MULTIPLE: "Một hoặc nhiều sản phẩm không tồn tại",
    //   NOT_ENOUGH_STOCK: "Hàng trong kho không đủ",
    // },
    VARIANT: {
      SINGLE: "Variant không tồn tại",
      MULTIPLE: "Một hoặc nhiều variant không tồn tại",
    },
  },
  AUTH: {
    UNAUTHENTICATED: "Bạn chưa đăng nhập",
    UNAUTHORIZED: "Bạn không có quyền truy cập",
    PASSWORD_MISMATCH: "Mật khẩu không khớp",
  },
  VERYFY_TOKEN: {
    NOT_FOUND: "Token không hợp lệ hoặc đã hết hạn",
    NOT_FOUND_OR_EXPIRED: "Token không hợp lệ hoặc đã hết hạn",
    EXPIRED: "Token đã hết hạn",
  },
  USER: {
    NOT_FOUND: "Người dùng không tồn tại",
    NOT_VERIFIED: "Tài khoản chưa được xác minh",
    NOT_CREDENTIALS: "Tài khoản không được đăng ký với mật khẩu",
    LOCKED: "Tài khoản đã bị khóa",
  },
  BLOG: {
    NOT_FOUND: "Blog không tồn tại",
  },
  CATEGORY: {
    NOT_FOUND: "Danh mục không tồn tại",
  },
  PRODUCT: {
    NOT_FOUND: "Sản phẩm không tồn tại",
    NOT_ENOUGH_STOCK: "Hàng trong kho không đủ",
    NOT_AVAILABLE: "Sản phẩm hiện không kinh doanh",
  },
  TAG: {
    NOT_FOUND: "Thẻ không tồn tại",
  },
  COUPON: {
    NOT_FOUND: "Mã giảm giá không tồn tại",
    INVALID_COUPON: "Mã giảm giá không hợp lệ",
  },
  CART: {
    NOT_FOUND: "Giỏ hàng trống",
  },
  CHECKOUT: {
    NOT_FOUND: "Thanh toán không tồn tại",
    ITEM_NOT_AVAILABLE: "Sản phẩm không hợp lệ hoặc không đủ hàng",
  },
  REVIEW: {
    NOT_FOUND: "Bình luận không tồn tại",
  },
  ORDER: {
    CREATE: {
      SUCCESS: "Đã tạo đơn hàng thành công",
      ERROR: {
        GENERAL: "Tạo đơn hàng thất bại",
        UNAVAILABLE: "Sản phẩm không hợp lệ hoặc không đủ hàng",
      },
    },
    NOT_FOUND: "Đơn hàng không tồn tại",
  },
};

export const TOAST_MESSAGES = {
  UPDATE: {
    SUCCESS: "Đã cập nhật thông tin thành công",
    ERROR: "Cập nhật thông tin thất bại",
  },
  DELETE: {
    SUCCESS: "Đã xóa thông tin thành công",
    ERROR: "Xóa thông tin thất bại",
  },
  CREATE: {
    SUCCESS: "Đã tạo thông tin thành công",
    ERROR: "Tạo thông tin thất bại",
  },
  PRODUCT: {
    NOT_ENOUGH_STOCK: "Hàng trong kho không đủ",
  },
  AUTH: {
    SIGN_UP: {
      SUCCESS: "Đã đăng ký thành công",
      ERROR: "Đăng ký thất bại",
    },
    LOGIN: {
      SUCCESS: "Đã đăng nhập thành công",
      NOT_MATCH: "Email hoặc Mật khẩu không khớp",
      ERROR: "Đăng nhập thất bại",
    },
  },
  CHECKOUT: {
    CREATE: {
      SUCCESS: "Thanh toán thành công",
      ERROR: "Thanh toán thất bại",
    },
  },
  CART: {
    ADD: {
      SUCCESS: "Đã thêm vào giỏ thành công",
      ERROR: "Thêm vào giỏ thất bại",
    },
  },
  REVIEW: {
    CREATE: {
      SUCCESS: "Đã gửi đánh giá thành công",
      ERROR: "Gửi đánh giá thất bại",
    },
    HIDE: {
      SUCCESS: "Đã ẩn đánh giá thành công",
    },
    RESTORE: {
      SUCCESS: "Đã khôi phục đánh giá thành công",
    },
    DELETE: {
      SUCCESS: "Đã xóa đánh giá thành công",
    },
  },
  ORDER: {
    CREATE: {
      SUCCESS: "Đã tạo đơn hàng thành công",
      ERROR: {
        GENERAL: "Tạo đơn hàng thất bại",
        UNAVAILABLE: "Sản phẩm không hợp lệ hoặc không đủ hàng",
      },
    },
  },
  USER: {
    LOCK: {
      SUCCESS: "Đã khóa tài khoản thành công",
    },
    UNLOCK: {
      SUCCESS: "Đã mở khóa tài khoản thành công",
    },
  },
};
