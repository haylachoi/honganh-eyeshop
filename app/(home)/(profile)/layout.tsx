import { CustomerAvatarProvider } from "./customer-avatar-provider";
import { ProfileSidebar } from "./profile-sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center lg:flex-row gap-4 container">
      <div className="lg:w-[400px] xl:w-[500px] border border-foreground px-2 py-4 space-y-4">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="border-b border-input pb-2">
            <CustomerAvatarProvider />
          </div>
          <ProfileSidebar className="flex gap-y-4 md:flex-col" />
        </div>
      </div>
      <div className="px-2 border border-foreground grow">{children}</div>
    </div>
  );
}
