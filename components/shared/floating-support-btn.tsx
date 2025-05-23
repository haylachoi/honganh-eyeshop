import { getSettings } from "@/features/settings/settings.services";
import Image from "next/image";
import Link from "next/link";

export const FloatingSupportBtn = async () => {
  const settings = await getSettings();
  const siteSettings = settings?.site;
  if (!siteSettings) {
    return null;
  }

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
