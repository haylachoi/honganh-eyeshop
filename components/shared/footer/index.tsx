import { ENDPOINTS } from "@/constants/endpoints.constants";
import { DEFAULT_SETTINGS } from "@/features/settings/settings.constants";
import { getSettings } from "@/features/settings/settings.services";
import { POLICY_PAGE } from "@/features/support-pages/support-pages.constants";
import { cn, formatPhone } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Footer = async ({ className }: Readonly<{ className?: string }>) => {
  const settings = await getSettings();
  const siteSettings = settings?.site || DEFAULT_SETTINGS.site;
  const policyPages = POLICY_PAGE;

  return (
    <footer className={cn("bg-foreground text-background py-12", className)}>
      <div className="container grid lg:grid-cols-2 gap-6">
        <div>
          <FooterGroupTitle title="Thông tin liên hệ" />
          <ul>
            <li>Địa chỉ: {siteSettings.address}</li>
            {siteSettings.businessRegistrationNumber && (
              <li>MSDN: {siteSettings.businessRegistrationNumber}</li>
            )}
            <li>
              <Link href={`mailto:${siteSettings.email}`}>
                Email: {siteSettings.email}
              </Link>
            </li>
            {siteSettings.legalRepresentative && (
              <li>Người đại diện: {siteSettings.legalRepresentative}</li>
            )}
            <li>
              <Link
                className="cursor-pointer"
                href={formatPhone({ phone: siteSettings.phone, type: "tel" })}
              >
                Số điện thoại: {formatPhone({ phone: siteSettings.phone })}
              </Link>
            </li>
          </ul>
        </div>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))]">
          <div>
            <FooterGroupTitle title="Về Hồng Anh" />
            <ul>
              <li>
                <Link className="" href={ENDPOINTS.SUPPORT.ABOUT_US}>
                  Giới thiệu về{" "}
                  <span className="uppercase">{siteSettings.name}</span>
                </Link>
              </li>
              <li>
                <Link href={ENDPOINTS.SUPPORT.STORES}>Hệ thống cửa hàng</Link>
              </li>
            </ul>
          </div>
          <div>
            <FooterGroupTitle title="Chính sách" />
            <ul>
              {policyPages.map((policy) => (
                <li key={policy.slug}>
                  <Link href={`${ENDPOINTS.SUPPORT.HOME}/${policy.slug}`}>
                    {policy.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <FooterGroupTitle title="Hỗ trợ khách hàng" />
            <ul>
              <li>
                <Link href={ENDPOINTS.SUPPORT.CONTACT}>
                  Liên hệ với chúng tôi
                </Link>
              </li>
              <li>
                <Link href={ENDPOINTS.SUPPORT.RECRUITMENT}>Tuyển dụng</Link>
              </li>
              <li>
                <Link href={ENDPOINTS.SUPPORT.FAQ}>Câu hỏi thường gặp</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const FooterGroupTitle = ({ title }: { title: string }) => {
  return <h3 className="uppercase font-semibold">{title}</h3>;
};
