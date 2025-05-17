import { z } from "zod";
import { SettingType } from "./settings.types";
import { responsiveSchema } from "./settings.validator";

export const STORE_TYPES_LIST = ["showroom", "warehouse", "other"] as const;
export const SOCIAL_TYPES_LIST = ["chat", "network", "video"] as const;
export const ANCHOR_LIST = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

const defaultResponsive: z.infer<typeof responsiveSchema> = {
  image: {
    url: "",
  },
  mainTitle: {
    isActive: false,
    value: "",
    size: 0,
    color: "",
    position: {
      anchor: "top-left",
      xValue: "0",
      yValue: "0",
    },
  },
  subTitle: {
    isActive: false,
    value: "",
    size: 0,
    color: "",
    position: {
      anchor: "top-left",
      xValue: "0",
      yValue: "0",
    },
  },
  callToAction: {
    isActive: false,
    value: "",
    size: 0,
    color: "",
    bgColor: "",
    url: "",
    position: {
      anchor: "top-left",
      xValue: "0",
      yValue: "0",
    },
  },
};

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
    socialLinks: [],
  },
  sellers: {
    socialIcons: {
      icon1: {
        name: "Facebook",
        url: "",
      },
      icon2: {
        name: "Instagram",
        url: "",
      },
      icon3: {
        name: "Youtube",
        url: "",
      },
    },
    list: [
      {
        name: "Nguyễn Văn Nhật",
        email: "nv@nv.com.vn",
        phone: "123-456-7890",
        socialMedia1: "https://www.facebook.com/honganh.eyeshop",
        socialMedia2: "https://www.instagram.com/honganh.eyeshop",
        socialMedia3: "https://www.youtube.com/channel/UC7-0-3-9-1",
        isActive: true,
      },
    ],
  },
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
      contactInfo: {
        phone: "",
        email: "",
        facebook: "",
        zalo: "",
      },
      openingHours: "",
      type: STORE_TYPES_LIST[0],
      isOpenNow: true,
    },
  ],
  banners: {
    benefits: {
      isActive: true,
      items: [
        {
          title: "",
          description: "",
          details: "",
          icon: "",
        },
      ],
    },
    homeHero: {
      isActive: false,
      mobile: defaultResponsive,
      tablet: defaultResponsive,
      desktop: defaultResponsive,
    },
  },
};
