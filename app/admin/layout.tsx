import { DialogProvider } from "@/components/shared/alert-dialog-provider";
import { AdminSidebar } from "./admin-sidebar";
import { TansTackQueryClientProvider } from "./query-client-provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TansTackQueryClientProvider>
      <div className="container grid grid-cols-[50px_1fr] has-[#admin-sidebar-toggle:checked]:grid-cols-[200px_1fr] transition-all">
        <AdminSidebar />
        <DialogProvider>
          <div className="px-4 overflow-auto pt-4">{children}</div>
        </DialogProvider>
      </div>
    </TansTackQueryClientProvider>
  );
};

export default Layout;
