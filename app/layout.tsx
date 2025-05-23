import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Rubik } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { APP_NAME, BASE_URL } from "@/constants";
import { getSettings } from "@/features/settings/settings.services";

const rubik = Rubik({
  subsets: ["latin"], // Hỗ trợ chữ Latin
  variable: "--font-rubik",
  weight: ["300", "400", "500", "700"], // Chọn các trọng số cần dùng
  display: "swap",
});

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSettings();
  const appName = settings?.site?.name || APP_NAME;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: appName,
      template: `%s - ${appName}`,
    },
    description:
      "Hồng Anh – Cửa hàng kính mắt uy tín, chuyên cung cấp kính thời trang, kính cận, kính râm và gọng kính chất lượng cao. Miễn phí đo mắt, giao hàng toàn quốc.",
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} antialiased scroll-smooth`}>
        <NextTopLoader showSpinner={false} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
