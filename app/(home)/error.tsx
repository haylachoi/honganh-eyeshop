"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">
        Đã xảy ra lỗi!
      </h2>
      <p className="text-gray-600 mb-6">Vui lòng thử lại hoặc quay lại sau.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
      >
        Thử lại
      </button>
    </div>
  );
}
