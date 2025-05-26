import productRepository from "@/lib/db/repositories/products";
import {
  createCollection,
  deleteCollection,
  getCollections,
  importDocuments,
  searchDocuments,
  // truncateCollection,
} from "../typesense.utils";
import {
  buildTypesenseQuery,
  buildTypesenseSorting,
} from "./product.queries-builder";
import { typesenseProductName, typesenseProductSchema } from "./product.schema";
import { defaultProductSearchParrams } from "./product.constants";
import { DEFAULT_SORTING, SORTING_KEYWORDS } from "@/constants";
import { ProductPreview } from "@/features/products/product.types";

const collectionName = typesenseProductName;

export const getProductCollections = async () => {
  const collection = await getCollections(collectionName);
  return collection;
};

export const createProductCollection = async () => {
  await createCollection(collectionName, typesenseProductSchema);
};

export const populateProductsCollection = async () => {
  const products = await productRepository.getAllProducts();
  const input = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    nameNoAccent: product.nameNoAccent,
    category: {
      name: product.category.name,
      slug: product.category.slug,
    },
    prices: product.variants.map((v) => v.price),
    minPrice: product.minPrice,
    maxPrice: product.maxPrice,
    highestDiscount: product.highestDiscount,
    attributes: product.attributes,
    tags: product.tags,
    variants: product.variants,
  }));

  // await truncateCollection(collectionName);
  await importDocuments(collectionName, input);
};

export const deleteProductCollection = async () => {
  await deleteCollection(collectionName);
};

export const searchProducts = async ({
  search,
  filter,
  page,
  size,
  sortBy,
  orderBy,
}: {
  search?: string;
  filter?: Record<string, string>;
  sortBy?: string;
  orderBy?: string;
  page: number;
  size: number;
}) => {
  const filterString = buildTypesenseQuery({ filter });
  if (!sortBy) {
    sortBy = DEFAULT_SORTING.products[SORTING_KEYWORDS.sort_by];
  }
  if (!orderBy) {
    orderBy = DEFAULT_SORTING.products[SORTING_KEYWORDS.order_by];
  }
  const sortString = buildTypesenseSorting({ sortBy, orderBy });

  const result = await searchDocuments<ProductPreview>(collectionName, {
    q: search ?? "*",
    query_by: "name,nameNoAccent",
    infix: ["always", "always"],
    filter_by: filterString,
    ...defaultProductSearchParrams,
    sort_by: sortString,
    page,
    per_page: size,
  });
  return {
    total: result.found,
    page: result.page,
    size: size,
    items: result.hits?.map((hit) => hit.document) ?? [],
  };
};
