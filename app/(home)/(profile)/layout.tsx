import Link from "next/link";
import { CustomerAvatarProvider } from "./customer-avatar-provider";

const info = [
  {
    title: "Thông tin cá nhân",
    href: "/user-info",
  },
  {
    title: "Địa chỉ",
    href: "/user-address",
  },
];
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 container">
      <div className="lg:w-[300px] border border-foreground p-4">
        <CustomerAvatarProvider />
        <ul>
          {info.map((item) => (
            <li key={item.title}>
              <Link href={item.href}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border border-foreground grow">{children}</div>
    </div>
  );
}
