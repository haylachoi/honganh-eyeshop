// import AdminHeader from "./admin-header";
import { DialogProvider } from "@/components/shared/alert-dialog-provider";
import { AdminSidebar } from "./admin-sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container grid grid-cols-[50px_1fr] has-[#admin-sidebar-toggle:checked]:grid-cols-[200px_1fr] transition-all">
      <AdminSidebar />
      <DialogProvider>
        <div className="px-4 overflow-auto">{children}</div>
      </DialogProvider>
    </div>
  );
};

export default Layout;
