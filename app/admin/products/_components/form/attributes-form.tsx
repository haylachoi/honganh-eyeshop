import FormTextInput from "@/components/shared/form/form-text-input";
import { FormLabel } from "@/components/ui/form";
import {
  ProductInputType,
  ProductUpdateType,
} from "@/features/products/product.types";
import { useFormContext } from "react-hook-form";

export const AttributesForm = () => {
  const { watch, control } = useFormContext<
    ProductInputType | ProductUpdateType
  >();

  const attributes = watch("attributes");
  return (
    <>
      {!!attributes.length && (
        <>
          <FormLabel>Thuộc tính</FormLabel>
          <ul className="flex flex-col gap-2 border border-input p-3 rounded-md shadow-sm">
            {attributes.map((attribute, index) => (
              <li key={attribute.name}>
                <FormTextInput
                  control={control}
                  name={`attributes.${index}.value`}
                  label={attribute.name}
                  placeholder={attribute.name}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};
