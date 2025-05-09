import { toast } from "sonner";
import { ProductType } from "../../../../features/products/product.types";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { useAction } from "next-safe-action/hooks";
import { deleteProductAction } from "../../../../features/products/product.actions";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu/index";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { getLink } from "@/lib/utils";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { onActionError } from "@/lib/actions/action.helper";
import { ThreeDotsMenuLink } from "@/components/shared/three-dots-menu/three-dots-menu-link";

export const ActionButton = ({ product }: { product: ProductType }) => {
  const { execute, isPending } = useAction(deleteProductAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DELETE.SUCCESS);
    },
    onError: onActionError,
  });
  const { showDialog } = useGlobalAlertDialog();

  return (
    <ThreeDotsMenu>
      <ThreeDotsMenuButtonItem
        action={() => showDialog({ onConfirm: () => execute(product.id) })}
        isPending={isPending}
      >
        Xóa
      </ThreeDotsMenuButtonItem>
      <ThreeDotsMenuLink href={getLink.product.update({ id: product.id })}>
        Cập nhật
      </ThreeDotsMenuLink>
    </ThreeDotsMenu>
  );
};
