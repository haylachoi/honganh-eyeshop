import { cn } from "@/lib/utils";
import React from "react";

const QuantityInput = ({
  value,
  setValue,
  max,
  className,
  ...props
}: Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "onChange" | "onBlur" | "pattern"
> & {
  value: string;
  setValue: (value: string) => void;
  max: number;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    if (inputValue === "") {
      setValue("");
      return;
    }

    const numValue = Math.min(+inputValue, max);
    setValue(numValue.toString());
  };

  const handleBlur = () => {
    if (value === "" || value === "0") {
      setValue("1");
    }
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      pattern="\d*"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn("border p-1 text-center", className)}
    />
  );
};

export default QuantityInput;
