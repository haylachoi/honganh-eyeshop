import Image from "next/image";
import { CircleUserRound } from "lucide-react";
import { SafeUserInfoFromSession } from "@/features/users/user.types";

export const UserAvatar = ({
  className,
  user,
}: {
  className?: string;
  user: SafeUserInfoFromSession | undefined;
}) => {
  if (!user) {
    return (
      <div>
        <CircleUserRound className={className} />
      </div>
    );
  }
  const initials = getInitials(user.name);
  return (
    <div className={className}>
      {user.avatar ? (
        <Image
          className="size-full"
          src={user.avatar}
          alt="avatar"
          width={200}
          height={200}
        />
      ) : (
        initials
      )}
    </div>
  );
};

function getInitials(name: string) {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
