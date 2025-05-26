import { searchBlogs as typesenseSearchBlogs } from "@/features/fts/typesense/blog/blog.service";
import { searchBlogs as dbSearchBlogs } from "@/features/filter/filter.services";
import { NextRequest, NextResponse } from "next/server";
import { KEYWORDS, PAGE_SIZE, SEARCH_ENGINE } from "@/constants";
import { getLink } from "@/lib/utils";
import { searchProducts as dbSearchProducts } from "@/features/filter/filter.services";
import { searchProducts as typesenseSearchProducts } from "@/features/fts/typesense/product/product.service";

const searchProducts = SEARCH_ENGINE.typesense
  ? typesenseSearchProducts
  : dbSearchProducts;

const searchBlogs = SEARCH_ENGINE.typesense
  ? typesenseSearchBlogs
  : dbSearchBlogs;

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    [KEYWORDS.filter.search]: search,
    [KEYWORDS.pagination.page]: pageStr,
    [KEYWORDS.pagination.size]: sizeStr,
  } = body;

  const input = {
    search,
    page: Number(pageStr) || 1,
    size: Number(sizeStr) || PAGE_SIZE.DEFAULT,
  };

  try {
    const products = await searchProducts(input);
    const blogs = await searchBlogs(input);

    const data = {
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

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const {
    [KEYWORDS.pagination.page]: pageStr,
    [KEYWORDS.pagination.size]: sizeStr,
    [KEYWORDS.filter.search]: search,
  } = Object.fromEntries(searchParams.entries());

  const input = {
    search,
    page: Number(pageStr) || 1,
    size: Number(sizeStr) || PAGE_SIZE.DEFAULT,
  };

  try {
    const products = await searchProducts(input);
    const blogs = await searchBlogs(input);

    const data = {
      products,
      blogs,
    };

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
