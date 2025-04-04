import React from "react";
import AdminHeader from "./admin-header";
import { DialogProvider } from "@/components/shared/alert-dialog-provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      <AdminHeader />
      <DialogProvider>
        <div>{children}</div>
      </DialogProvider>
    </div>
  );
};

export default Layout;
