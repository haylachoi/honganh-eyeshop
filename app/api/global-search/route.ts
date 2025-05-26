import { searchBlogs } from "@/features/fts/typesense/blog/blog.service";
import { searchProducts } from "@/features/fts/typesense/product/product.service";
import { NextRequest, NextResponse } from "next/server";
import { KEYWORDS, PAGE_SIZE } from "@/constants";

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

    const result = {
      products,
      blogs,
    };

    return NextResponse.json({ success: true, result });
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

    const result = {
      products,
      blogs,
    };

    return NextResponse.json({ success: true, result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
