import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";

interface FormTextInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

const FormTextInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  ...rest
}: FormTextInputProps<T> &
  Omit<
    React.ComponentProps<"input">,
    "name" | "value" | "onChange" | "onBlur"
  >) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...rest}
              {...field}
              placeholder={placeholder}
              onFocus={(e) => {
                if (e.target.value == "0") e.target.select();
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextInput;
