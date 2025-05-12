import { ADDRESS, EMAIL, EMAIL_LINK, PHONE, PHONE_LINK } from "@/constants";
import { ENDPOINTS } from "@/constants/endpoints.constants";
import { getPolicyPreviews } from "@/features/others/other.services";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Footer = async ({ className }: Readonly<{ className?: string }>) => {
  const policyPreviews = await getPolicyPreviews();
  return (
    <footer className={cn("bg-foreground text-background py-12", className)}>
      <div className="container grid lg:grid-cols-2 gap-6">
        <div>
          <FooterGroupTitle title="Thông tin liên hệ" />
          <ul>
            <li>Địa chỉ: {ADDRESS}</li>
            <li>MSDN: 1234567890</li>
            <li>
              <Link href={EMAIL_LINK}>Email: {EMAIL}</Link>
            </li>
            <li>Người đại diện: 123 Nguyễn Văn Nhật, Đồng Nai, Hà Nội</li>
            <li>
              <Link className="cursor-pointer" href={PHONE_LINK}>
                Số điện thoại: {PHONE}
              </Link>
            </li>
          </ul>
        </div>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))]">
          <div>
            <FooterGroupTitle title="Về Hồng Anh" />
            <ul>
              <li>
                <Link href={ENDPOINTS.SUPPORT.ABOUT_US}>
                  Giới thiệu Hồng Anh
                </Link>
              </li>
              <li>
                <Link href="/stores">Hệ thống cửa hàng</Link>
              </li>
            </ul>
          </div>
          <div>
            <FooterGroupTitle title="Chính sách" />
            <ul>
              {policyPreviews.map((policyPreview) => (
                <li key={policyPreview.slug}>
                  <Link href={`/${ENDPOINTS.POLICY}/${policyPreview.slug}`}>
                    {policyPreview.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <FooterGroupTitle title="Hỗ trợ khách hàng" />
            <ul>
              <li>
                <Link href="/contact-us">Liên hệ với chúng tôi</Link>
              </li>
              <li>
                <Link href="/recruitment">Tuyển dụng</Link>
              </li>
              <li>
                <Link href="/faq">Câu hỏi thường gặp</Link>
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
