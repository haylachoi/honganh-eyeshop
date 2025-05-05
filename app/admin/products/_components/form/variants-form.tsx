"use client";

import { FormLabel } from "@/components/ui/form";
import React from "react";
import {
  ArrayPath,
  FieldArray,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import {
  ProductInputType,
  ProductUpdateType,
} from "@/features/products/product.types";
import { Button } from "@/components/ui/button";
import FormTextInput from "@/components/shared/form/form-text-input";
import {
  Tabs,
  TabList,
  TabTrigger,
  TabPanel,
} from "@/components/custom-ui/tabs";
import {
  VariantImageUploader,
  VariantMultiImageUploader,
} from "./image-uploader";

export const VariantsForm = <T extends ProductUpdateType | ProductInputType>({
  name,
  defaultValue,
}: {
  name: ArrayPath<T>;
  defaultValue: FieldArray<T, ArrayPath<T>> | FieldArray<T, ArrayPath<T>>[];
}) => {
  const form = useFormContext<T>();
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <>
      <Tabs
        className="border border-input p-2 rounded-md shadow-sm"
        defaultValue={fields?.[0]?.id}
      >
        <div className="flex items-center gap-2 mb-4">
          <TabList>
            {fields.map((field, index) => (
              <div key={field.id} className="relative flex items-center gap-2">
                <TabTrigger
                  value={field.id}
                  className="cursor-pointer py-2 px-6 rounded-md border border-secondary"
                  activeClassName="border-primary border"
                >
                  Tùy chọn {index + 1}
                </TabTrigger>
                <button
                  tabIndex={-1}
                  className="absolute top-1 right-1 size-4 grid place-content-center text-[8px] text-destructive cursor-pointer bg-secondary rounded-full"
                  onClick={() => remove(index)}
                >
                  X
                </button>
              </div>
            ))}
          </TabList>
          <Button
            type="button"
            tabIndex={-1}
            variant="outline"
            size="sm"
            className=""
            onClick={() => append(defaultValue)}
          >
            +
          </Button>
        </div>

        {fields.map((field, index) => (
          <TabPanel isHidden={true} value={field.id} key={field.id}>
            <VariantForm index={index} />
          </TabPanel>
        ))}
      </Tabs>
    </>
  );
};

const VariantForm = ({ index }: { index: number }) => {
  const { getValues, control } = useFormContext<
    ProductInputType | ProductUpdateType
  >();
  const id: string | undefined = getValues("id");
  return (
    <div>
      <FormTextInput
        control={control}
        name={`variants.${index}.originPrice`}
        label="Giá gốc"
        placeholder="Nhập giá gốc"
      />
      <FormTextInput
        control={control}
        name={`variants.${index}.price`}
        label="Giá sản phẩm"
        placeholder="Nhập giá sản phẩm"
      />

      <FormTextInput
        control={control}
        name={`variants.${index}.countInStock`}
        label="Số lượng trong kho"
        placeholder="Nhập số lượng trong kho"
      />
      {id && id !== "" ? (
        <VariantMultiImageUploader index={index} />
      ) : (
        <VariantImageUploader index={index} />
      )}
      <VariantAttributeForm VariantIndex={index} />
    </div>
  );
};

const VariantAttributeForm = ({ VariantIndex }: { VariantIndex: number }) => {
  const form = useFormContext<ProductInputType | ProductUpdateType>();
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${VariantIndex}.attributes`,
  });

  return (
    <div className="mt-4">
      <FormLabel>Thuộc tính</FormLabel>
      <ul className="max-h-80 overflow-y-auto">
        {fields.map((field, index) => (
          <li key={field.id} className="mt-2 flex items-start gap-2">
            <FormTextInput
              control={control}
              name={`variants.${VariantIndex}.attributes.${index}.name`}
              placeholder="Nhập tên thuộc tính"
            />

            <FormTextInput
              control={control}
              name={`variants.${VariantIndex}.attributes.${index}.value`}
              placeholder="Nhập giá trị"
            />

            <Button
              type="button"
              tabIndex={-1}
              variant="destructive"
              onClick={() => remove(index)}
            >
              X
            </Button>
          </li>
        ))}
      </ul>
      {/* Add New Attribute */}
      <Button
        type="button"
        variant="outline"
        className="w-max mt-2"
        onClick={() =>
          append({
            name: "",
            value: "",
          })
        }
      >
        + Thêm thuộc tính
      </Button>
    </div>
  );
};
