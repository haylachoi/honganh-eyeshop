import { getSettings } from "@/features/settings/settings.queries";
import Image from "next/image";
import Link from "next/link";

export const FloatingSupportBtn = async () => {
  const settingsResult = await getSettings();
  if (!settingsResult.success) {
    return null;
  }
  const settings = settingsResult.data;
  const siteSettings = settings.site;
  return (
    <ul className="fixed bottom-[30px] right-[10px] flex flex-col gap-2">
      {siteSettings?.socialLinks
        .filter((link) => link.url !== "" && link.icon !== "")
        .map((link) => (
          <Link
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={link.icon}
              alt={link.name}
              width={50}
              height={50}
              className="rounded-full"
            />
          </Link>
        ))}
    </ul>
  );
};
