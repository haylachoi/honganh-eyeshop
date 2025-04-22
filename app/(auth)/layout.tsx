import { SimpleHeader } from "@/components/shared/simple-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SimpleHeader />
      {children}
    </div>
  );
}
