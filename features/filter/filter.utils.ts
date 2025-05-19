import { currencyFormatter } from "@/lib/utils";
import { FILTER_NAME } from "./filter.constants";

export const getPriceFilterOptions = () => {
  return {
    name: FILTER_NAME.PRICE,
    displayName: "Giá",
    values: [
      {
        value: `< ${currencyFormatter.format(100_000)}`,
        valueSlug: "0-100000",
      },
      {
        value: `${currencyFormatter.format(100_000)} - ${currencyFormatter.format(500_000)}`,
        valueSlug: "100000-500000",
      },
      {
        value: `> ${currencyFormatter.format(500_000)}`,
        valueSlug: "500000-0",
      },
    ],
  };
};

export const getSaleFilterOptions = () => {
  return {
    name: FILTER_NAME.SALE,
    displayName: FILTER_NAME.SALE,
    values: [
      {
        value: "Đang giảm giá",
        valueSlug: "1",
      },
    ],
  };
};
