import { LiaShippingFastSolid } from "react-icons/lia";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { LiaHeart } from "react-icons/lia";
import { BenefitInfo, PolicyPreview } from "@/features/others/other.types";

export const getBenefitInfos: () => Promise<BenefitInfo[]> = async () => {
  return data;
};

const data: BenefitInfo[] = [
  {
    title: "Miễn phí toàn quốc",
    subTitle: "Cho hóa đơn ít nhất 1000.000đ",
    description: "",
    Icon: LiaShippingFastSolid,
  },
  {
    title: "Đổi trả trong 30 ngày",
    subTitle: "Ngay cả khi không thích",
    description: "",
    Icon: LiaExchangeAltSolid,
  },
  {
    title: "Chỉ từ 50.000đ",
    subTitle: "Chất lượng tối đa",
    description: "",
    Icon: LiaHeart,
  },
];

export const getPolicyPreviews = async () => {
  return policyPreviewsSample;
};

const policyPreviewsSample: PolicyPreview[] = [
  {
    title: " Điều khoản dịch vụ",
    slug: "dieu-khoan-dich-vu",
  },
  {
    title: "Chính sách thanh toán",
    slug: "chinh-sach-thanh-toan",
  },
  {
    title: "Chính sách giao hàng",
    slug: "chinh-sach-giao-hang",
  },
  {
    title: "Chính sách bảo hành",
    slug: "chinh-sach-bao-hanh",
  },
  {
    title: "Chính sách đổi trả",
    slug: "chinh-sach-doi-tra",
  },
];
