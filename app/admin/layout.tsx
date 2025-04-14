import React from "react";
import AdminHeader from "./admin-header";
import { DialogProvider } from "@/components/shared/alert-dialog-provider";
import TopLoadingIndicator from "@/components/shared/loading-indicator";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      <TopLoadingIndicator />
      <AdminHeader />
      <DialogProvider>
        <div>{children}</div>
      </DialogProvider>
    </div>
  );
};

export default Layout;
