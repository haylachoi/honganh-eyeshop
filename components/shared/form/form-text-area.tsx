import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface FormTextAreaProps<T extends FieldValues> {
  control: Control<T>;
  name: keyof T;
  label: string;
  placeholder?: string;
}

const FormTextArea = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: FormTextAreaProps<T>) => {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder={placeholder} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormTextArea;
