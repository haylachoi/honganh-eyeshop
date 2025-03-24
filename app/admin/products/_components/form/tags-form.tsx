import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ProductInputType,
  ProductUpdateType,
} from "@/features/products/product.types";
import { TagType } from "@/features/tags/tag.type";
import { useFormContext } from "react-hook-form";

export const TagsForm = ({ tags }: { tags: TagType[] }) => {
  const { watch, setValue } = useFormContext<
    ProductInputType | ProductUpdateType
  >();

  const selectedTags = watch("tags");

  const handleTagsChange = ({ id, name }: { id: string; name: string }) => {
    if (selectedTags.find((tag) => tag.id === id)) {
      setValue(
        "tags",
        selectedTags.filter((tag) => tag.id !== id),
      );
    } else {
      setValue("tags", [...selectedTags, { id, name }]);
    }
  };
  return (
    <>
      <FormLabel>Tags</FormLabel>
      <ul className="flex gap-4 flex-wrap border border-input p-3 rounded-md shadow-sm">
        {tags.map((tag) => (
          <li key={tag.id}>
            <Label className="cursor-pointer">
              <Input
                className="size-6 cursor-pointer"
                type="checkbox"
                checked={selectedTags.some(
                  (selectedTag) => selectedTag.id === tag.id,
                )}
                onChange={() => handleTagsChange(tag)}
              />
              {tag.name}
            </Label>
          </li>
        ))}
      </ul>
    </>
  );
};
