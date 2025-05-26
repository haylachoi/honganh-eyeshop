import { NextRequest, NextResponse } from "next/server";
import { KEYWORDS, PAGE_SIZE, SEARCH_ENGINE } from "@/constants";
import { getLink } from "@/lib/utils";

import {
  searchProducts as dbSearchProducts,
  searchBlogs as dbSearchBlogs,
} from "@/features/filter/filter.services";
import { searchProducts as typesenseSearchProducts } from "@/features/fts/typesense/product/product.service";
import { searchBlogs as typesenseSearchBlogs } from "@/features/fts/typesense/blog/blog.service";
import { GlobalSearchResult } from "@/features/filter/filter.types";

const searchProducts = SEARCH_ENGINE.typesense
  ? typesenseSearchProducts
  : dbSearchProducts;

const searchBlogs = SEARCH_ENGINE.typesense
  ? typesenseSearchBlogs
  : dbSearchBlogs;

const getInputFromRequest = async (req: NextRequest, isPost = false) => {
  const source = isPost
    ? await req.json()
    : Object.fromEntries(new URL(req.url).searchParams.entries());

  const search = source[KEYWORDS.filter.search];
  const page = Number(source[KEYWORDS.pagination.page]) || 1;
  const size = Number(source[KEYWORDS.pagination.size]) || PAGE_SIZE.DEFAULT;

  return { search, page, size };
};

const formatSearchResult = async (input: {
  search: string;
  page: number;
  size: number;
}) => {
  const [products, blogs] = await Promise.all([
    searchProducts(input),
    searchBlogs(input),
  ]);
  const result: GlobalSearchResult = {
    products: {
      items: products.items.map((item) => ({
        id: item.id,
        name: item.name,
        link: getLink.product.home({
          productSlug: item.slug,
          categorySlug: item.category.slug,
        }),
        image: item.variants[0]?.images[0],
        price: item.variants[0]?.price,
      })),
      total: products.total,
    },
    blogs: {
      items: blogs.items.map((item) => ({
        id: item.id,
        title: item.title,
        link: item.link,
        image: item.image,
      })),
      total: blogs.total,
    },
  };

  return result;
};

export const POST = async (req: NextRequest) => {
  try {
    const input = await getInputFromRequest(req, true);
    const data = await formatSearchResult(input);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const input = await getInputFromRequest(req);
    const data = await formatSearchResult(input);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
