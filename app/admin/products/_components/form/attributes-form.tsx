import FormTextInput from "@/components/shared/form/form-text-input";
import { FormLabel } from "@/components/ui/form";
import {
  ProductInputType,
  ProductUpdateType,
} from "@/features/products/product.types";
import { slugifyVn } from "@/lib/utils";
import React from "react";
import { useFormContext } from "react-hook-form";

export const AttributesForm = () => {
  const { watch } = useFormContext<ProductInputType | ProductUpdateType>();

  const attributes = watch("attributes");

  return (
    <>
      {!!attributes.length && (
        <>
          <FormLabel>Thuộc tính</FormLabel>
          <ul className="flex flex-col gap-2 border border-input p-3 rounded-md shadow-sm">
            {attributes.map((attribute, index) => (
              <li key={attribute.name}>
                <AttributeInput index={index} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

const AttributeInput = ({ index }: { index: number }) => {
  const { watch, control, setValue } = useFormContext<
    ProductInputType | ProductUpdateType
  >();

  const attribute = watch(`attributes.${index}`);

  React.useEffect(() => {
    console.log(slugifyVn(attribute.value));
    setValue(`attributes.${index}.valueSlug`, slugifyVn(attribute.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attribute.value, setValue]);

  return (
    <>
      <FormTextInput
        control={control}
        name={`attributes.${index}.value`}
        label={attribute.name}
        placeholder={attribute.name}
      />
    </>
  );
};
