import { LiaShippingFastSolid } from "react-icons/lia";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { LiaHeart } from "react-icons/lia";
import { BenefitInfo } from "@/features/others/other.types";

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
