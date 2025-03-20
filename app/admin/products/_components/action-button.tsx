import { toast } from "sonner";
import { ProductType } from "../../../../features/products/product.types";
import { TOAST_MESSAGES } from "@/constants";
import { useAction } from "next-safe-action/hooks";
import { deleteProductAction } from "../../../../features/products/product.actions";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu/index";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getLink } from "@/lib/utils";
import Link from "next/link";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { onActionError } from "@/lib/actions/action.helper";

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
      <DropdownMenuItem>
        <Link href={getLink.product.update({ productSlug: product.slug })}>
          Cập nhật
        </Link>
      </DropdownMenuItem>
    </ThreeDotsMenu>
  );
};
