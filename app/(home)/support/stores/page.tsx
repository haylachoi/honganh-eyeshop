import { DEFAULT_SETTINGS } from "@/features/settings/settings.constants";
import { StoresView } from "./Stores-view";
import { SupportPagesHeading } from "../_components/heading";
import { getSettings } from "@/features/settings/settings.services";

const StoresPage = async () => {
  const settings = await getSettings();

  const storesSettings = settings?.stores ?? DEFAULT_SETTINGS.stores;

  return (
    <div className="container">
      <SupportPagesHeading>Hệ thống cửa hàng</SupportPagesHeading>
      <StoresView stores={storesSettings} />
    </div>
  );
};

export default StoresPage;
