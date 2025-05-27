import { FILTER_KEYWORDS } from "@/constants";
import { currencyFormatter } from "@/lib/utils";

export const getPriceFilterOptions = () => {
  return {
    name: FILTER_KEYWORDS.price,
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
    name: FILTER_KEYWORDS.sale,
    displayName: FILTER_KEYWORDS.sale,
    values: [
      {
        value: "Đang giảm giá",
        valueSlug: "1",
      },
    ],
  };
};
