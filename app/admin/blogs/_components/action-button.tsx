import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import { useAction } from "next-safe-action/hooks";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu/index";
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
  return (
    <ThreeDotsMenu>
      <SetPublishedStatusButton blog={blog} />
      <DeleteBlogButton blog={blog} />
      <DropdownMenuItem>
        <Link href={getLink.blog.update({ id: blog.id })}>Cập nhật</Link>
      </DropdownMenuItem>
    </ThreeDotsMenu>
  );
};

const SetPublishedStatusButton = ({ blog }: { blog: BlogType }) => {
  const { execute, isPending } = useAction(setPublishedBlogStatusAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.UPDATE.SUCCESS);
    },
    onError: onActionError,
  });

  return (
    <ThreeDotsMenuButtonItem
      action={() =>
        execute({
          ids: blog.id,
          isPublished: !blog.isPublished,
        })
      }
      isPending={isPending}
    >
      {blog.isPublished ? "Chuyển thành nháp" : "Công khai"}
    </ThreeDotsMenuButtonItem>
  );
};

const DeleteBlogButton = ({ blog }: { blog: BlogType }) => {
  const { execute, isPending } = useAction(deleteBlogAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DELETE.SUCCESS);
    },
    onError: onActionError,
  });

  const { showDialog } = useGlobalAlertDialog();

  return (
    <ThreeDotsMenuButtonItem
      action={() => showDialog({ onConfirm: () => execute(blog.id) })}
      isPending={isPending}
    >
      Xóa
    </ThreeDotsMenuButtonItem>
  );
};
