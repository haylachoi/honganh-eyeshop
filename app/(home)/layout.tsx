import Breadcrumb from "@/components/shared/breadcrumb";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { FloatingSupportBtn } from "@/components/shared/floating-support-btn";
import { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="home__layout h-dvh grid grid-rows-[auto_1fr_auto]">
      <div className="">
        <Header />
        <Breadcrumb />
      </div>
      <div className="">{children}</div>
      <Footer className="mt-12" />
      <Suspense fallback={null}>
        <FloatingSupportBtn />
      </Suspense>
    </div>
  );
}
