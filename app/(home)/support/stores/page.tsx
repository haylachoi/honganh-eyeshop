import { DEFAULT_SETTINGS } from "@/features/settings/settings.constants";
import { getSettings } from "@/features/settings/settings.queries";
import { StoresView } from "./Stores-view";

const StoresPage = async () => {
  const settingsResult = await getSettings();
  const settings = settingsResult.success
    ? settingsResult.data
    : DEFAULT_SETTINGS;

  const storesSettings = settings.stores || DEFAULT_SETTINGS.stores;

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Hệ thống cửa hàng</h1>
      <StoresView stores={storesSettings} />
    </div>
  );
};

export default StoresPage;
