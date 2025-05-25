import { SearchParams } from "typesense/lib/Typesense/Documents";

export const defaultProductSearchParrams: SearchParams = {
  num_typos: 2,
  typo_tokens_threshold: 100,
  drop_tokens_threshold: 0,
  exhaustive_search: true,
};
