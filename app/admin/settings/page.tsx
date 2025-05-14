import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SellersSettingsUpdateType,
  SiteSettingsUpdateType,
} from "@/features/settings/settings.types";
import { SiteFormUpdate } from "./_components/site-form.update";
import { getSettings } from "@/features/settings/settings.queries";
import { SellerFormUpdate } from "./_components/seller-form.update";
import { DEFAULT_SETTINGS } from "@/features/settings/settings.constants";

const siteDefaultValues: SiteSettingsUpdateType = DEFAULT_SETTINGS.site;
const SiteSettingsProvider = async () => {
  const result = await getSettings();
  const defaultValues: SiteSettingsUpdateType = result.success
    ? result.data.site
    : siteDefaultValues;

  return <SiteFormUpdate defaultValues={defaultValues} />;
};

const sellerDefaultValues: SellersSettingsUpdateType = DEFAULT_SETTINGS.sellers;

const SellerSettingsProvider = async () => {
  const result = await getSettings();
  const defaultValues: SellersSettingsUpdateType =
    result.success && result.data.sellers.length > 0
      ? result.data.sellers
      : sellerDefaultValues;

  return (
    <SellerFormUpdate
      defaultValues={{
        sellers: defaultValues,
      }}
    />
  );
};
const tabs = [
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
];

const SettingsPage = () => {
  return (
    <div className="">
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-2">
          {tabs.map((tab) => (
            <TabsTrigger
              className="cursor-pointer"
              key={tab.value}
              value={tab.value}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.title}</CardTitle>
                <CardDescription>{tab.description}</CardDescription>
              </CardHeader>
              <CardContent>{tab.content}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
