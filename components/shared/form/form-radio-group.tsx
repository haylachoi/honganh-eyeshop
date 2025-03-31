import { Control, FieldValues, Path, PathValue } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import React from "react";

interface FormRadioGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  defaultValue?: PathValue<T, Path<T>> | undefined;
  data: { value: string; label: string }[];
}

const FormRadioGroup = <T extends FieldValues>({
  control,
  name,
  label,
  defaultValue,
  data,
}: FormRadioGroupProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {data &&
                data.map((item) => (
                  <FormItem
                    key={item.value}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl className="cursor-pointer">
                      <RadioGroupItem value={item.value} />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormRadioGroup;
