"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/custom-ui/submit-button";
import { TrashIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import { createOrUpdateBannersSettingsAction } from "@/features/settings/settings.actions";
import FormTextInput from "@/components/shared/form/form-text-input";
import { useEffect } from "react";
import { updateSearchParam } from "@/lib/utils";
import { bannersSettingsUpdateSchema } from "@/features/settings/settings.validator";
import { UploadFileIcon } from "./upload-icon";
import { BannersSettingsType } from "@/features/settings/settings.types";
import FormCheckbox from "@/components/shared/form/form-check-box";
import FormSelectInput from "@/components/shared/form/form-select-input";
import { ANCHOR_LIST } from "@/features/settings/settings.constants";

const responsiveDevices = ["mobile", "tablet", "desktop"] as const;

type ResponsiveDevice = (typeof responsiveDevices)[number];
type ContentBlockType = "mainTitle" | "subTitle" | "callToAction";

const updateSchema = bannersSettingsUpdateSchema;
type formType = z.infer<typeof updateSchema>;

export const BannersFormUpdate = ({
  defaultValues,
}: {
  defaultValues: BannersSettingsType;
}) => {
  const form = useForm<formType>({
    resolver: zodResolver(updateSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "benefits.items",
  });

  const { execute, isPending } = useAction(
    createOrUpdateBannersSettingsAction,
    {
      onSuccess: () => toast.success("Cập nhật thành công"),
      onError: onActionError,
    },
  );

  useEffect(() => {
    updateSearchParam("tab", "banners");
  }, []);

  const onSubmit = (data: formType) => {
    execute(data);
  };

  const renderContentBlockInputs = (
    device: ResponsiveDevice,
    block: ContentBlockType,
  ) => (
    <div key={block} className="space-y-2 border-t pt-4">
      <h4 className="font-medium capitalize">{block}</h4>

      <FormCheckbox
        label="Hiển thị"
        control={form.control}
        name={`homeHero.${device}.${block}.isActive`}
      />

      <FormTextInput
        control={form.control}
        name={`homeHero.${device}.${block}.value`}
        label="Nội dung"
      />

      <FormTextInput
        control={form.control}
        name={`homeHero.${device}.${block}.size`}
        label="Kích thước font"
        type="number"
      />

      <FormSelectInput
        label="Anchor"
        name={`homeHero.${device}.${block}.position.anchor`}
        control={form.control}
        list={ANCHOR_LIST}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormTextInput
          control={form.control}
          name={`homeHero.${device}.${block}.position.xValue`}
          label="X"
          type="number"
        />
        <FormTextInput
          control={form.control}
          name={`homeHero.${device}.${block}.position.yValue`}
          label="Y"
          type="number"
        />
      </div>

      {block === "callToAction" && (
        <FormTextInput
          control={form.control}
          name={`homeHero.${device}.${block}.url`}
          label="Liên kết"
        />
      )}
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Benefits section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Benefit Banners</h2>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 relative border p-4 rounded"
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold text-lg">
                  Benefit banner {index + 1}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </div>

              <FormTextInput
                control={form.control}
                name={`benefits.items.${index}.title`}
                label="Tiêu đề"
              />

              <FormTextInput
                control={form.control}
                name={`benefits.items.${index}.description`}
                label="Mô tả"
              />

              <FormTextInput
                control={form.control}
                name={`benefits.items.${index}.details`}
                label="Chi tiết"
              />

              <UploadFileIcon
                name={`benefits.items.${index}.icon`}
                control={form.control}
                defaultValue={typeof field.icon === "string" ? field.icon : ""}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                title: "",
                description: "",
                details: "",
                icon: "",
              })
            }
          >
            Thêm benefit
          </Button>

          <FormCheckbox
            label="Kích hoạt benefit"
            control={form.control}
            name="benefits.isActive"
          />
        </div>

        <Separator className="my-4" />

        {/* Home Hero section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Home Hero</h2>

          <FormCheckbox
            label="Kích hoạt home hero"
            control={form.control}
            name="homeHero.isActive"
          />

          {responsiveDevices.map((device) => (
            <div
              key={device}
              className="border p-4 rounded space-y-4 bg-muted/30"
            >
              <h3 className="text-lg font-semibold capitalize">{device}</h3>

              <UploadFileIcon
                name={`homeHero.${device}.image.url`}
                control={form.control}
                defaultValue={
                  defaultValues.homeHero?.[device]?.image?.url ?? ""
                }
              />

              {["mainTitle", "subTitle", "callToAction"].map((block) =>
                renderContentBlockInputs(device, block as ContentBlockType),
              )}
            </div>
          ))}
        </div>

        <SubmitButton label="Lưu" isLoading={isPending} />
      </form>
    </Form>
  );
};
