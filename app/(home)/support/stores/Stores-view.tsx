"use client";

import { SettingType } from "@/features/settings/settings.types";
import { useState } from "react";

export const StoresView = ({ stores }: { stores: SettingType["stores"] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedStore = stores[selectedIndex];

  // Nếu không có link sẵn thì tạo link từ tọa độ
  const getMapLink = (store: SettingType["stores"][number]) => {
    if (store.location.googleMapLink && store.location.googleMapLink !== "")
      return store.location.googleMapLink;
    return `https://www.google.com/maps?q=${store.location.latitude},${store.location.longitude}&z=15&output=embed`;
  };

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

      {/* Danh sách cửa hàng */}
      <div className="overflow-y-auto space-y-4 pr-2">
        {stores.map((store, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`p-4 border rounded-lg cursor-pointer transition hover:bg-gray-50 ${
              index === selectedIndex
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
