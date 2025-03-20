import { Button } from "@/components/ui/button";
import MainPageHeading from "./main-page-heading";
import Link from "next/link";

export default function AdminMainTopSection({
  title,
  addNewLink,
}: {
  title: string;
  addNewLink: string;
}) {
  return (
    <div className="flex justify-between items-end gap-2 mb-4">
      <MainPageHeading title={title} />
      <Button asChild>
        <Link href={addNewLink}>Thêm</Link>
      </Button>
    </div>
  );
}
