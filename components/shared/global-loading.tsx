export const GlobalLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center flex-col text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50" />
      <p className="mt-4 text-gray-600">Đang tải dữ liệu, vui lòng đợi...</p>
    </div>
  );
};
