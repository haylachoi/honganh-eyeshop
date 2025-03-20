import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
      <Footer className="mt-12" />
    </div>
  );
}
