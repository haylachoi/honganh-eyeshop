import { ENDPOINTS } from "@/constants/endpoints.constants";
import { FILTER_KEYWORDS } from "@/constants";
import { searchBlogsByQuery } from "@/features/blogs/blog.queries";
import { getLink } from "@/lib/utils";
import { BLOG_FILTER_NAMES } from "@/features/blogs/blog.contants";
import { MainNavigation } from "./main-navigation";

type SubLinkType = {
  title: string;
  links: { title: string; href: string }[];
};

type SubImageLinkType = {
  title: string;
  image: string;
  href: string;
};

export type LinkType = {
  title: string;
  contents: (SubLinkType | SubImageLinkType)[];
};

const links: LinkType[] = [
  {
    title: "Kính mắt",
    contents: [
      {
        title: "Mua ngay",
        links: [
          {
            title: "Kính nam",
            href: getLink.search({
              queries: [{ key: "gender", value: "nam" }],
            }),
          },
          {
            title: "Kính nữ",
            href: getLink.search({
              queries: [{ key: "gender", value: "nu" }],
            }),
          },
        ],
      },
      {
        title: "Nổi bật",
        links: [
          {
            title: "Phổ biến",
            href: getLink.search({
              queries: [{ key: "tag", value: "trending" }],
            }),
          },
          {
            title: "Giảm giá",
            href: getLink.search({
              queries: [{ key: FILTER_KEYWORDS.sale, value: "1" }],
            }),
          },
          {
            title: "Sắp về",
            href: getLink.search({
              queries: [{ key: "tag", value: "new-arrival" }],
            }),
          },
        ],
      },
      {
        title: "Hot",
        image: "/navigation/cheap-glasses.webp",
        href: getLink.search({
          queries: [{ key: "tag", value: "deal-hot" }],
        }),
      },
    ],
  },
  {
    title: "Xem thêm",
    contents: [
      // {
      //   title: "Bài viết",
      //   links: [{ title: "", href: "/" }],
      // },
      {
        title: "Hướng dẫn",
        links: [
          {
            title: "Hệ thống cửa hàng",
            href: `${ENDPOINTS.SUPPORT.STORES}`,
          },
        ],
      },
      {
        title: "Hỗ trợ",
        links: [
          { title: "Về chúng tôi", href: `${ENDPOINTS.SUPPORT.ABOUT_US}` },
          { title: "Liên hệ", href: `${ENDPOINTS.SUPPORT.CONTACT}` },
        ],
      },
    ],
  },
];

export const MainNavigationProvider = async () => {
  const blogsResult = await searchBlogsByQuery({
    params: {
      [BLOG_FILTER_NAMES.TAGS]: "nav",
      [BLOG_FILTER_NAMES.ISPUBLISHED]: "1",
    },
    size: 3,
    page: 1,
  });

  if (
    blogsResult.success &&
    blogsResult.data.items.length > 0 &&
    !links[1].contents.some((link) => link.title === "Bài viết")
  ) {
    links[1].contents.unshift({
      title: "Bài viết",
      links: blogsResult.data.items.map((blog) => ({
        title: blog.title,
        href: getLink.blog.view({ blogSlug: blog.slug }),
      })),
    });
  }
  return <MainNavigation links={links} />;
};
