import React from "react";
import AdminHeader from "./admin-header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      <AdminHeader />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
