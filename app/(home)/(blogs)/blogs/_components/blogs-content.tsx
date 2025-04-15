import BlogPreview from "@/components/shared/blog-preview";
import { BlogType } from "@/features/blogs/blog.types";
import { QueryResult } from "@/lib/query/query.type";

// export const BlogsContent = ({
//   streamingData,
// }: {
//   streamingData: Promise<QueryResult<BlogType[]>>;
// }) => {
//   const data = use(streamingData);
//   const items = data.success ? data.data : [];
//
//   return (
//     <div>
//       <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-[auto_1fr_auto_auto] gap-x-8 gap-y-10">
//         {items.map((blog) => (
//           <li
//             key={blog.id}
//             className="grid grid-rows-subgrid row-span-4 shadow-sm gap-y-0 nth-[n+5]:hidden md:nth-[n+7]:hidden xl:nth-[n+9]:hidden"
//           >
//             <BlogPreview blog={blog} />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

export const BlogsContent = ({ data }: { data: QueryResult<BlogType[]> }) => {
  const items = data.success ? data.data : [];

  return (
    <div>
      <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-[auto_1fr_auto_auto] gap-x-8 gap-y-10">
        {items.map((blog) => (
          <li
            key={blog.id}
            className="grid grid-rows-subgrid row-span-4 shadow-sm gap-y-0 nth-[n+5]:hidden md:nth-[n+7]:hidden xl:nth-[n+9]:hidden"
          >
            <BlogPreview blog={blog} />
          </li>
        ))}
      </ul>
    </div>
  );
};
