import React from "react";
import TagsView from "@/app/admin/tags/tags-view";
import { getAllTags } from "@/features/tags/tag.queries";
import MainPageHeading from "@/components/shared/admin/main-page-heading";

const Tags = async () => {
  const result = await getAllTags();
  if (!result.success) {
    return <div>Error</div>;
  }
  const tags = result.data;
  return (
    <div>
      <MainPageHeading className="mb-4" title="Danh sách tags" />
      <TagsView tags={tags} />
    </div>
  );
};

export default Tags;
