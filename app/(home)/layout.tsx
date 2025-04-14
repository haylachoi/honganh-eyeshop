import Breadcrumb from "@/components/shared/breadcrumb";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import TopLoadingIndicator from "@/components/shared/loading-indicator";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="home__layout h-dvh grid grid-rows-[auto_1fr_auto]">
      <TopLoadingIndicator />
      <div className="space-y-2">
        <Header />
        <Breadcrumb />
      </div>
      <div className="mt-2">{children}</div>
      <Footer className="mt-12" />
    </div>
  );
}
