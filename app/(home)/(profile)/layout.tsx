import { CustomerAvatarProvider } from "./customer-avatar-provider";
import { ProfileSidebar } from "./profile-sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 container">
      <div className="lg:w-[400px] xl:w-[500px] border border-foreground p-2 space-y-4">
        <div className="border-b border-input pb-2">
          <CustomerAvatarProvider />
        </div>
        <ProfileSidebar className="flex gap-y-4 md:flex-col" />
      </div>
      <div className="px-2 border border-foreground grow">{children}</div>
    </div>
  );
}
