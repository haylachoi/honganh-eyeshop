/* eslint-disable @typescript-eslint/no-explicit-any */
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import { typesenseClient } from "./typesense.client";
import {
  SearchParams,
  SearchParamsWithPreset,
} from "typesense/lib/Typesense/Documents";

export const checkHealth = async () => {
  const health = await typesenseClient.health.retrieve();
  return health;
};

export const createCollection = async (
  collectionName: string,
  schema: CollectionCreateSchema,
) => {
  try {
    const collection = await typesenseClient
      .collections(collectionName)
      .retrieve();
    return collection;
  } catch (error) {
    console.error(collectionName, error);
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ObjectNotFound"
    ) {
      return await typesenseClient.collections().create(schema);
    }
    throw error;
  }
};

export const importDocuments = async (
  collectionName: string,
  documents: any[],
) => {
  return typesenseClient
    .collections(collectionName)
    .documents()
    .import(documents, { action: "upsert" });
};

export const createDocument = async (collectionName: string, document: any) => {
  const collection = await typesenseClient
    .collections(collectionName)
    .retrieve();
  if (!collection) {
    throw new Error(`Collection ${collectionName} not found`);
  }
  return typesenseClient
    .collections(collectionName)
    .documents()
    .create(document);
};

export const upsertDocument = async (collectionName: string, document: any) => {
  const collection = await typesenseClient
    .collections(collectionName)
    .retrieve();
  if (!collection) {
    throw new Error(`Collection ${collectionName} not found`);
  }
  return typesenseClient
    .collections(collectionName)
    .documents()
    .upsert(document);
};

export const searchDocuments = async (
  collectionName: string,
  query: SearchParams | SearchParamsWithPreset,
) => {
  const result = await typesenseClient
    .collections(collectionName)
    .documents()
    .search(query);
  return result;
};

export const truncateCollection = async (collectionName: string) => {
  return typesenseClient
    .collections(collectionName)
    .documents()
    .delete({ truncate: true });
};

export const deleteCollection = async (collectionName: string) => {
  return typesenseClient.collections(collectionName).delete();
};

export const getCollections = async (collectionName: string) => {
  const collections = await typesenseClient
    .collections(collectionName)
    .retrieve();
  return collections;
};
