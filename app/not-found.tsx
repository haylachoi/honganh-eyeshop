import { ENDPOINTS } from "@/constants/endpoints.constants";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen items-center justify-center flex-col text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Không tìm thấy trang</h1>
      <p className="text-gray-500 mb-6">
        Trang bạn đang tìm không tồn tại hoặc đã bị xóa.
      </p>
      <Link
        href={ENDPOINTS.HOME}
        className="text-primary hover:underline font-medium text-lg"
      >
        ← Quay về trang chủ
      </Link>
    </div>
  );
}
