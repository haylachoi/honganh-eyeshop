import { AboutUsDefaultPage } from "@/app/(home)/support/_components/about-us-default";
import { ContactDefaultPage } from "@/app/(home)/support/_components/contact-default";

export const AVAILABEL_SUPPORT_PAGES = [
  {
    slug: "about-us",
    title: "Về chúng tôi",
    description:
      "Tìm hiểu về Hồng Anh Eyewear – lịch sử, sứ mệnh và tầm nhìn phát triển.",
    keywords: ["Hồng Anh", "giới thiệu", "về chúng tôi", "kính mắt", "eyewear"],
    defaultPage: AboutUsDefaultPage,
  },
  {
    slug: "contact",
    title: "Liên hệ với chúng tôi",
    description:
      "Liên hệ với cửa hàng kính mắt Hồng Anh – chúng tôi luôn sẵn sàng hỗ trợ bạn.",
    keywords: ["liên hệ", "kính mắt", "Hồng Anh", "địa chỉ", "số điện thoại"],
    defaultPage: ContactDefaultPage,
  },
  {
    slug: "terms-of-service",
    title: "Điều khoản dịch vụ",
    description:
      "Điều khoản sử dụng dịch vụ tại Hồng Anh Eyewear – vui lòng đọc kỹ trước khi mua hàng.",
    keywords: ["điều khoản", "dịch vụ", "sử dụng", "chính sách", "Hồng Anh"],
  },
  {
    slug: "payment-policy",
    title: "Chính sách thanh toán",
    description:
      "Hướng dẫn và điều kiện thanh toán khi mua hàng tại Hồng Anh Eyewear.",
    keywords: ["thanh toán", "chính sách", "mua hàng", "kính mắt", "Hồng Anh"],
  },
  {
    slug: "shipping-policy",
    title: "Chính sách giao hàng",
    description:
      "Chi tiết chính sách giao hàng và thời gian vận chuyển của Hồng Anh Eyewear.",
    keywords: ["giao hàng", "vận chuyển", "kính mắt", "chính sách", "Hồng Anh"],
  },
  {
    slug: "warranty-policy",
    title: "Chính sách bảo hành",
    description:
      "Thông tin về thời gian và điều kiện bảo hành sản phẩm tại Hồng Anh Eyewear.",
    keywords: ["bảo hành", "kính", "Hồng Anh", "chính sách", "sản phẩm"],
  },
  {
    slug: "return-and-exchange-policy",
    title: "Chính sách đổi trả",
    description:
      "Chính sách đổi trả hàng hóa trong trường hợp lỗi hoặc không hài lòng tại Hồng Anh Eyewear.",
    keywords: ["đổi trả", "trả hàng", "kính mắt", "chính sách", "Hồng Anh"],
  },
];
