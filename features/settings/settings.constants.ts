import { SettingType } from "./settings.types";

export const STORE_TYPES_LIST = ["showroom", "warehouse", "other"] as const;
export const DEFAULT_SETTINGS: Required<SettingType> = {
  site: {
    name: "Kính mắt Hồng Anh",
    logo: "https://www.honganh.com/images/logo.png",
    slogan: "Nét đẹp từ ánh nhìn đầu tiên",
    description:
      "Hồng Anh – Cửa hàng kính mắt uy tín, chuyên cung cấp kính thời trang, kính cận, kính râm và gọng kính chất lượng cao. Miễn phí đo mắt, giao hàng toàn quốc.",
    email: "nv@nv.com.vn",
    phone: "123-456-7890",
    address: "123 Nguyễn Văn Nhật, Đồng Nai, Hà Nội",
    businessRegistrationNumber: "1234567890",
    legalRepresentative: "Nguyễn Văn Nhật",
  },
  sellers: [
    {
      name: "sdfs ",
      email: "sdfsdf",
      phone: "sdfs",
      facebook: "sdfs",
      isActive: true,
    },
  ],
  stores: [
    {
      name: "sdfs ",
      description: "sdfsdf",
      addressInfo: {
        address: "sdlf",
        district: "sdfs",
        province: "sdf",
        postalCode: "sdfs",
      },
      location: { latitude: 0, longitude: 0, googleMapLink: "" },
      openingHours: "",
      type: STORE_TYPES_LIST[0],
      isOpenNow: true,
    },
  ],
};
