import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TOAST_MESSAGES } from "@/constants";
import { createTagAction } from "@/features/tags/tag.actions";
import { TagInputType } from "@/features/tags/tag.type";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { tagInputSchema } from "../../../features/tags/tag.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/custom-ui/submit-button";

const TagFormCreate = () => {
  const { execute, isPending } = useAction(createTagAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.CREATE.SUCCESS);
    },
    onError: onActionError,
  });

  const form = useForm<TagInputType>({
    resolver: zodResolver(tagInputSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex "
        onSubmit={form.handleSubmit((data) => execute(data))}
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
        <SubmitButton
          isLoading={isPending}
          label="Tạo"
          type="submit"
          disabled={isPending}
        />
      </form>
    </Form>
  );
};

export default TagFormCreate;
