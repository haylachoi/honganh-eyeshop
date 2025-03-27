import React from "react";

const useQuantity = (opts?: { initialValue?: string }) => {
  const initialValue = opts?.initialValue ?? "1";
  return React.useState(initialValue);
};

export default useQuantity;
