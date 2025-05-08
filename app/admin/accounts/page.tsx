import { getSafeAdminUserInfo } from "@/features/users/user.queries";
import AdminAccountsView from "./_components/admin-accounts-view";
import { ADMIN_ENDPOINTS } from "@/constants";
import AdminMainTopSection from "@/components/shared/admin/main-top-section";

const AccountsPage = async () => {
  const result = await getSafeAdminUserInfo();

  if (!result.success) {
    return <div>Error</div>;
  }

  const users = result.data;

  return (
    <div>
      <AdminMainTopSection
        title="Danh sách tài khoản"
        addNewLink={`${ADMIN_ENDPOINTS.ACCOUNTS}/create`}
      />
      <AdminAccountsView users={users} />
    </div>
  );
};
export default AccountsPage;
