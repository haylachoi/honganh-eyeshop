import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BannersSettingsType,
  SellersSettingsUpdateType,
  SiteSettingsType,
  StoresSettingsUpdateType,
} from "@/features/settings/settings.types";
import { SiteFormUpdate } from "./_components/site-form.update";
import { getSettings } from "@/features/settings/settings.queries";
import { SellerFormUpdate } from "./_components/seller-form.update";
import { DEFAULT_SETTINGS } from "@/features/settings/settings.constants";
import { StoreFormUpdate } from "./_components/store-form.update";
import { SearchParams } from "@/types";
import { BannersFormUpdate } from "./_components/banner-form.update";
import { SupportPages } from "./_components/support-pages-";

const siteDefaultValues: SiteSettingsType = DEFAULT_SETTINGS.site;
const SiteSettingsProvider = async () => {
  const result = await getSettings();
  const defaultValues: SiteSettingsType =
    result.success && result.data.site ? result.data.site : siteDefaultValues;

  return <SiteFormUpdate defaultValues={defaultValues} />;
};

const sellerDefaultValues: SellersSettingsUpdateType = DEFAULT_SETTINGS.sellers;

const SellerSettingsProvider = async () => {
  const result = await getSettings();
  const defaultValues: SellersSettingsUpdateType =
    result.success && result.data.sellers
      ? result.data.sellers
      : sellerDefaultValues;

  return <SellerFormUpdate defaultValues={defaultValues} />;
};

const storeDefaultValues: StoresSettingsUpdateType = DEFAULT_SETTINGS.stores;
const StoreSettingsProvider = async () => {
  const result = await getSettings();
  const defaultValues: StoresSettingsUpdateType =
    result.success && result.data.stores.length > 0
      ? result.data.stores
      : storeDefaultValues;

  return (
    <StoreFormUpdate
      defaultValues={{
        stores: defaultValues,
      }}
    />
  );
};

const bannersDefaultValues: BannersSettingsType = DEFAULT_SETTINGS.banners;

const BannersSettingsProvider = async () => {
  const result = await getSettings();
  const defaultValues: BannersSettingsType =
    result.success && result.data.banners
      ? result.data.banners
      : bannersDefaultValues;

  return <BannersFormUpdate defaultValues={defaultValues} />;
};

const tabsInfo = [
  {
    value: "general",
    title: "Chung",
    description: "Thông tin chung về trang web của bạn.",
    content: <SiteSettingsProvider />,
  },
  {
    value: "sellers",
    title: "Nhân viên",
    description: "Thông tin về nhân viên bán hàng.",
    content: <SellerSettingsProvider />,
  },
  {
    value: "stores",
    title: "Cửa hàng",
    description: "Thông tin về cửa hàng.",
    content: <StoreSettingsProvider />,
  },
  {
    value: "banners",
    title: "Banner",
    description: "Thông tin về banner.",
    content: <BannersSettingsProvider />,
  },
  {
    value: "support",
    title: "Trang hỗ trợ",
    description: "Thông tin về trang hỗ trợ.",
    content: <SupportPages />,
  },
];

const SettingsPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { tab } = await searchParams;
  const defaultTab =
    tabsInfo.some((item) => item.value === tab) && typeof tab === "string"
      ? tab
      : "general";

  return (
    <div className="">
      <Tabs defaultValue={defaultTab}>
        <TabsList className="">
          {tabsInfo.map((tab) => (
            <TabsTrigger
              className="cursor-pointer"
              key={tab.value}
              value={tab.value}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabsInfo.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
