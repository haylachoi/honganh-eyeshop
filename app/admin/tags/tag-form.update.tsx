import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { updateTagAction } from "@/features/tags/tag.actions";
import { TagUpdateType } from "@/features/tags/tag.type";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { tagUpdateSchema } from "../../../features/tags/tag.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/custom-ui/submit-button";
import { Button } from "@/components/ui/button";

const TagFormUpdate = ({
  defaultValues,
  setIsEditing,
}: {
  defaultValues: TagUpdateType;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { execute, isPending } = useAction(updateTagAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.UPDATE.SUCCESS);
      setIsEditing(false);
    },
    onError: onActionError,
  });

  const form = useForm<TagUpdateType>({
    resolver: zodResolver(tagUpdateSchema),
    defaultValues,
  });
  return (
    <Form {...form}>
      <form
        className="grid grid-cols-[1fr_auto] gap-4"
        onSubmit={form.handleSubmit((data) => {
          execute(data);
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <SubmitButton
            isLoading={isPending}
            label="Lưu"
            type="submit"
            disabled={!form.formState.isDirty}
          />
          <Button
            type="button"
            onClick={() => {
              form.reset();
              setIsEditing(false);
            }}
          >
            Hủy
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TagFormUpdate;
