import productRepository from "@/lib/db/repositories/products";
import {
  createCollection,
  deleteCollection,
  getCollections,
  importDocuments,
  searchDocuments,
  truncateCollection,
} from "../typesense.utils";
import {
  buildTypesenseQuery,
  buildTypesenseSorting,
} from "./product.queries-builder";
import { typesenseProductName, typesenseProductSchema } from "./product.schema";
import { defaultProductSearchParrams } from "./product.constants";

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
  }));

  await truncateCollection(collectionName);
  await importDocuments(collectionName, input);
};

export const deleteProductCollection = async () => {
  await deleteCollection(collectionName);
};

export const searchProducts = async ({
  query,
  filter,
  page,
  size,
  sortBy,
  orderBy,
}: {
  query?: string;
  filter?: Record<string, string>;
  sortBy?: string;
  orderBy?: string;
  page: number;
  size: number;
}) => {
  const filterString = buildTypesenseQuery({ filter });
  const sortString = buildTypesenseSorting({ sortBy, orderBy });

  const result = await searchDocuments(collectionName, {
    q: query ?? "*",
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
    items: result.hits?.map((hit) => hit.document) ?? [],
  };
};
