import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

const language = "vi";
export const typesenseProductName = "products";

export const typesenseProductSchema: CollectionCreateSchema = {
  name: typesenseProductName,
  enable_nested_fields: true,
  fields: [
    { name: "id", type: "string" },
    { name: "name", type: "string", sort: true, locale: language, infix: true }, // default, only number type can be sort
    { name: "nameNoAccent", type: "string", sort: true, infix: true }, // default, only number type can be sort
    { name: "minPrice", type: "int32" },
    { name: "prices", type: "int32[]", range_index: true },
    { name: "highestDiscount", type: "float" },
    { name: "category.slug", type: "string" }, // only index category.slug inside object
    { name: "tags.name", type: "string[]" }, // only index tags.name inside array of object
    // { name: "attributes", type: "object[]" },
    { name: "attributes.value", type: "string[]" },
    { name: "attributes.name", type: "string[]" },
  ],
  // default_sorting_field: "minPrice",
};
