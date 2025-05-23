export const GlobalLoading = () => {
  return (
    <div className="container flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <div className="w-12 h-12 rounded-full border-2 border-foreground animate-spin"></div>
        <div className="w-12 h-12 rounded-full border-2 border-foreground animate-spin"></div>
      </div>
    </div>
  );
};
