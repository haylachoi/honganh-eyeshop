import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { useAction } from "next-safe-action/hooks";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu/index";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { getLink } from "@/lib/utils";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { CategoryType } from "@/features/categories/category.types";
import { onActionError } from "@/lib/actions/action.helper";
import { deleteCategoryAction } from "@/features/categories/category.actions";
import { ThreeDotsMenuLink } from "@/components/shared/three-dots-menu/three-dots-menu-link";

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
        action={() =>
          showDialog({
            description:
              "Xóa danh mục cũng sẽ xóa các hàng hóa thuộc danh mục này. Có muốn xóa?",
            onConfirm: () => execute(category.id),
          })
        }
        isPending={isPending}
      >
        Xóa
      </ThreeDotsMenuButtonItem>
      <ThreeDotsMenuLink href={getLink.category.update({ id: category.id })}>
        Cập nhật
      </ThreeDotsMenuLink>
    </ThreeDotsMenu>
  );
};
