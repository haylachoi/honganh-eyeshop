import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSelectInputProps<Q, T extends FieldValues> {
  control: Control<T>;
  name: keyof T;
  label: string;
  placeholder?: string;
  list: Q[];
  listIdKey: keyof Q;
  listValueKey: keyof Q;
}

const FormSelectInput = <Q, T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  list,
  listIdKey,
  listValueKey,
}: FormSelectInputProps<Q, T>) => {
  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {list.map((item) => (
                  <SelectItem
                    key={String(item[listIdKey])}
                    value={String(item[listIdKey])}
                  >
                    {String(item[listValueKey])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelectInput;
