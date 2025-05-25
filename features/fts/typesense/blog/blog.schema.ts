import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

const language = "vi";
export const typesenseBlogName = "blogs";

export const typesenseBlogSchema: CollectionCreateSchema = {
  name: typesenseBlogName,
  enable_nested_fields: true,
  fields: [
    { name: "id", type: "string" },
    {
      name: "title",
      type: "string",
      locale: language,
      infix: true,
    },
    {
      name: "titleNoAccent",
      type: "string",
      infix: true,
    },
  ],
};
