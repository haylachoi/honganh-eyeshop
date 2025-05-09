import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { useAction } from "next-safe-action/hooks";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getLink } from "@/lib/utils";
import Link from "next/link";
import { BlogType } from "@/features/blogs/blog.types";
import {
  deleteBlogAction,
  setPublishedBlogStatusAction,
} from "@/features/blogs/blog.actions";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { onActionError } from "@/lib/actions/action.helper";

export const ActionButton = ({ blog }: { blog: BlogType }) => {
  const { showDialog } = useGlobalAlertDialog();

  const publishAction = useAction(setPublishedBlogStatusAction, {
    onSuccess: () => toast.success(TOAST_MESSAGES.UPDATE.SUCCESS),
    onError: onActionError,
  });

  const deleteAction = useAction(deleteBlogAction, {
    onSuccess: () => toast.success(TOAST_MESSAGES.DELETE.SUCCESS),
    onError: onActionError,
  });

  const handleTogglePublish = () => {
    publishAction.execute({
      ids: blog.id,
      isPublished: !blog.isPublished,
    });
  };

  const handleDelete = () => {
    showDialog({
      onConfirm: () => deleteAction.execute(blog.id),
    });
  };

  return (
    <ThreeDotsMenu>
      <ThreeDotsMenuButtonItem
        action={handleTogglePublish}
        isPending={publishAction.isPending}
      >
        {blog.isPublished ? "Chuyển thành nháp" : "Công khai"}
      </ThreeDotsMenuButtonItem>

      <ThreeDotsMenuButtonItem
        action={handleDelete}
        isPending={deleteAction.isPending}
      >
        Xóa
      </ThreeDotsMenuButtonItem>

      <DropdownMenuItem>
        <Link className="w-full" href={getLink.blog.update({ id: blog.id })}>
          Cập nhật
        </Link>
      </DropdownMenuItem>
    </ThreeDotsMenu>
  );
};
