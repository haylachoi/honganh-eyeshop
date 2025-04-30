"use client";

import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils";
import { useEffect, useState } from "react";

export const SidebarToggle = () => {
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    setChecked(JSON.parse(getFromLocalStorage("admin-sidebar-toggle", "true")));
  }, []);
  return (
    <input
      type="checkbox"
      className="hidden"
      id="admin-sidebar-toggle"
      checked={checked}
      onChange={(e) => {
        saveToLocalStorage({
          key: "admin-sidebar-toggle",
          value: JSON.stringify(e.target.checked),
        });
        setChecked(e.target.checked);
      }}
    />
  );
};
