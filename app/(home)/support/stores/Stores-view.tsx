"use client";

import { SettingType } from "@/features/settings/settings.types";
import { useMemo, useState } from "react";

export const StoresView = ({ stores }: { stores: SettingType["stores"] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const selectedStore = stores[selectedIndex];

  const getMapLink = (store: SettingType["stores"][number]) => {
    if (store.location.googleMapLink && store.location.googleMapLink !== "")
      return store.location.googleMapLink;
    return `https://www.google.com/maps?q=${store.location.latitude},${store.location.longitude}&z=15&output=embed`;
  };

  // Lấy danh sách tỉnh duy nhất
  const provinces = useMemo(() => {
    const all = stores.map((s) => s.addressInfo.province);
    return Array.from(new Set(all));
  }, [stores]);

  // Lấy danh sách huyện theo tỉnh đã chọn
  const districts = useMemo(() => {
    const filtered = stores.filter(
      (s) => s.addressInfo.province === selectedProvince,
    );
    const all = filtered.map((s) => s.addressInfo.district);
    return Array.from(new Set(all));
  }, [selectedProvince, stores]);

  // Lọc store theo tỉnh + huyện
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      const matchProvince = selectedProvince
        ? s.addressInfo.province === selectedProvince
        : true;
      const matchDistrict = selectedDistrict
        ? s.addressInfo.district === selectedDistrict
        : true;
      return matchProvince && matchDistrict;
    });
  }, [selectedProvince, selectedDistrict, stores]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[80vh]">
      {/* Bản đồ */}
      <div className="size-full lg:order-2">
        <iframe
          src={getMapLink(selectedStore)}
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          className="rounded-xl border w-full h-full"
        />
      </div>

      {/* Danh sách cửa hàng + bộ lọc */}
      <div className="overflow-y-auto space-y-4 pr-2">
        {/* Bộ lọc */}
        <div className="flex flex-col gap-2 md:flex-row">
          <select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedDistrict(""); // reset huyện khi đổi tỉnh
              setSelectedIndex(0);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full p-2 border rounded"
            disabled={!selectedProvince}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Danh sách cửa hàng */}
        {filteredStores.map((store, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`p-4 border rounded-lg cursor-pointer transition hover:bg-gray-50 ${
              stores.indexOf(store) === selectedIndex
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{store.name}</div>
              {typeof store.isOpenNow === "boolean" && (
                <span
                  className={`text-sm font-medium ${
                    store.isOpenNow ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {store.isOpenNow ? "Đang mở" : "Đã đóng"}
                </span>
              )}
            </div>

            {store.description && (
              <p className="text-sm text-gray-500">{store.description}</p>
            )}

            <div className="mt-2 text-sm text-gray-700 space-y-1">
              <div>
                📍 {store.addressInfo.address}, {store.addressInfo.district},{" "}
                {store.addressInfo.province}
              </div>
              {store.contactInfo?.phone && (
                <div>📞 {store.contactInfo.phone}</div>
              )}
              {store.contactInfo?.email && (
                <div>✉️ {store.contactInfo.email}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
