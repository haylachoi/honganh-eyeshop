import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import { useAction } from "next-safe-action/hooks";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu/index";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getLink } from "@/lib/utils";
import Link from "next/link";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { CategoryType } from "@/features/categories/category.types";
import { onActionError } from "@/lib/actions/action.helper";
import { deleteCategoryAction } from "@/features/categories/category.actions";

export const ActionButton = ({ category }: { category: CategoryType }) => {
  const { execute, isPending } = useAction(deleteCategoryAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DELETE.SUCCESS);
    },
    onError: onActionError,
  });

  const { showDialog } = useGlobalAlertDialog();

  return (
    <ThreeDotsMenu>
      <ThreeDotsMenuButtonItem
        action={() => showDialog({ onConfirm: () => execute(category.id) })}
        isPending={isPending}
      >
        Xóa
      </ThreeDotsMenuButtonItem>
      <DropdownMenuItem>
        <Link href={getLink.category.update({ categorySlug: category.slug })}>
          Cập nhật
        </Link>
      </DropdownMenuItem>
    </ThreeDotsMenu>
  );
};
