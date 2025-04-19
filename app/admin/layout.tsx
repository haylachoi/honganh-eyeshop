import React from "react";
import AdminHeader from "./admin-header";
import { DialogProvider } from "@/components/shared/alert-dialog-provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      <div className="border-b border-input py-2 mb-2">
        <AdminHeader />
      </div>
      <DialogProvider>
        <div>{children}</div>
      </DialogProvider>
    </div>
  );
};

export default Layout;
