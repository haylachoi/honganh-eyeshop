import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormTextInputProps<T extends FieldValues> {
  control: Control<T>;
  name: keyof T;
  label: string;
  placeholder?: string;
}

const FormTextInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: FormTextInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} placeholder={placeholder} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormTextInput;
