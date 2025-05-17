import { SupportPagesHeading } from "../_components/heading";
import { getSettings } from "@/features/settings/settings.queries";
import { SettingsType } from "@/features/settings/settings.types";
import Image from "next/image";
import { formatPhone } from "@/lib/utils";

export const ContactDefaultPage = async () => {
  const settingsResult = await getSettings();
  const settings = settingsResult.success ? settingsResult.data : null;

  return (
    <div className="container lg:max-w-4xl mx-auto py-12">
      <SupportPagesHeading>Liên hệ với chúng tôi</SupportPagesHeading>
      <SiteContactInfo settings={settings} />
      <SellersInfo settings={settings} />
    </div>
  );
};

const SiteContactInfo = ({ settings }: { settings: SettingsType | null }) => {
  const siteSettings = settings?.site;

  if (!siteSettings) {
    return <div>Chưa có thông tin</div>;
  }
  return (
    <section className="">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>

          <div className="mb-2 flex gap-2">
            <span>🏠 Địa chỉ:</span>
            <span className="font-medium">{siteSettings.address}</span>
          </div>

          <div className="mb-2 flex gap-2">
            <span>📞 Điện thoại:</span>
            <span className="font-medium">{siteSettings.phone}</span>
          </div>

          <div className="mb-2 flex gap-2">
            <span>✉️ Email:</span>
            <span className="font-medium">{siteSettings.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
const SellersInfo = ({ settings }: { settings: SettingsType | null }) => {
  const sellersSettings = settings?.sellers;
  if (!sellersSettings) return <div>Chưa có thông tin</div>;

  const socialIcons = sellersSettings.socialIcons;

  const getSocial = (key: "icon1" | "icon2" | "icon3") => {
    return socialIcons[key];
  };

  const renderSocialLink = (
    url: string,
    social: {
      url: string;
      name: string;
    },
  ): React.ReactNode => {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 flex gap-2"
      >
        <Image
          src={social.url}
          alt={social.name}
          width={20}
          height={20}
          className="object-contain"
        />
        {social.name}:<span className="text-link">{url}</span>
      </a>
    );
  };

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Nhân viên bán hàng
      </h2>

      <ul className="flex flex-col gap-4">
        {sellersSettings.list
          .filter((seller) => seller.isActive)
          .map((seller) => (
            <li key={seller.name} className="p-2 border border-input">
              <div className="text-lg font-semibold text-foreground/80 mb-2 capitalize">
                {seller.name}
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={formatPhone({ phone: seller.phone, type: "tel" })}
                  className="mb-2 flex gap-2"
                >
                  <span>📞 Điện thoại:</span>
                  <span className="text-link">{seller.phone}</span>
                </a>
                {renderSocialLink(seller.socialMedia1, getSocial("icon1"))}
                {renderSocialLink(seller.socialMedia2, getSocial("icon2"))}
                {renderSocialLink(seller.socialMedia3, getSocial("icon3"))}
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
};
