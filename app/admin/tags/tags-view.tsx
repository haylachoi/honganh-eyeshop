"use client";

import { Button } from "@/components/ui/button";
import { TOAST_MESSAGES } from "@/constants";
import { deleteTagAction } from "@/features/tags/tag.actions";
import { TagType } from "@/features/tags/tag.type";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { toast } from "sonner";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import TagFormCreate from "./tag-form.create";
import TagFormUpdate from "./tag-form.update";

const TagsView = ({ tags }: { tags: TagType[] }) => {
  return (
    <div>
      <TagFormCreate />
      <ul className="mt-4">
        {tags.map((tag) => (
          <li key={tag.id}>
            <TagItem tag={tag} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagsView;

const TagItem = ({ tag }: { tag: TagType }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const { showDialog } = useGlobalAlertDialog();

  const { execute: executeDelete, isPending: isDeletePending } = useAction(
    deleteTagAction,
    {
      onSuccess: () => {
        toast.success(TOAST_MESSAGES.DELETE.SUCCESS);
      },
      onError: onActionError,
    },
  );

  if (isEditing) {
    return <TagFormUpdate defaultValues={tag} setIsEditing={setIsEditing} />;
  }

  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-input">
      <span>{tag.name}</span>
      <div className="">
        <Button
          type="button"
          variant="ghost"
          className="text-primary"
          onClick={() => setIsEditing(true)}
          disabled={isEditing}
        >
          Sửa
        </Button>
        <Button
          className="text-destructive"
          type="button"
          variant="ghost"
          disabled={isEditing || isDeletePending}
          onClick={() => showDialog({ onConfirm: () => executeDelete(tag.id) })}
        >
          Xóa
        </Button>
      </div>
    </div>
  );
};
