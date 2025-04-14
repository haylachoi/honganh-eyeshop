import { FILTER_NAME } from "@/constants";
import { currencyFormatter } from "@/lib/utils";

export const getPriceFilterOptions = () => {
  return {
    name: FILTER_NAME.PRICE,
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
