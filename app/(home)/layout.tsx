import Breadcrumb from "@/components/shared/breadcrumb";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="home__layout h-dvh grid grid-rows-[auto_1fr_auto]">
      <Header />
      <Breadcrumb />
      {children}
      <Footer className="mt-12" />
    </div>
  );
}
