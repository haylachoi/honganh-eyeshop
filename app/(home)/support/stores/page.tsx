import { DEFAULT_SETTINGS } from "@/features/settings/settings.constants";
import { getSettings } from "@/features/settings/settings.queries";
import { StoresView } from "./Stores-view";
import { SupportPagesHeading } from "../_components/heading";

const StoresPage = async () => {
  const settingsResult = await getSettings();
  const settings = settingsResult.success
    ? settingsResult.data
    : DEFAULT_SETTINGS;

  const storesSettings = settings.stores || DEFAULT_SETTINGS.stores;

  return (
    <div className="container">
      <SupportPagesHeading>Hệ thống cửa hàng</SupportPagesHeading>
      <StoresView stores={storesSettings} />
    </div>
  );
};

export default StoresPage;
