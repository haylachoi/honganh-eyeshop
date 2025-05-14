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
    name: "benefits",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 relative">
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
              name={`benefits.${index}.title`}
              label="Tiêu đề"
            />

            <FormTextInput
              control={form.control}
              name={`benefits.${index}.description`}
              label="Mô tả"
            />

            <FormTextInput
              control={form.control}
              name={`benefits.${index}.details`}
              label="Chi tiết"
            />

            <UploadFileIcon
              name={`benefits.${index}.icon`}
              control={form.control}
              defaultValue={typeof field.icon === "string" ? field.icon : ""}
            />

            {index < fields.length - 1 && <Separator className="my-6" />}
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
          Thêm
        </Button>

        <SubmitButton label="Lưu" isLoading={isPending} />
      </form>
    </Form>
  );
};
