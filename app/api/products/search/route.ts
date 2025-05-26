import { KEYWORDS, PAGE_SIZE } from "@/constants";
import { searchProducts as dbSearchProducts } from "@/features/filter/filter.services";
import { searchProducts as typesenseSearchProducts } from "@/features/fts/typesense/product/product.service";
import { NextRequest, NextResponse } from "next/server";
import { SEARCH_ENGINE } from "@/constants";

const searchProducts = SEARCH_ENGINE.typesense
  ? typesenseSearchProducts
  : dbSearchProducts;

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    [KEYWORDS.filter.search]: search,
    [KEYWORDS.pagination.page]: pageStr,
    [KEYWORDS.pagination.size]: sizeStr,
    [KEYWORDS.sorting.sort_by]: sortBy,
    [KEYWORDS.sorting.order_by]: orderBy,
    ...filter
  } = body;

  try {
    const data = await searchProducts({
      search,
      filter,
      page: Number(pageStr) || 1,
      size: Number(sizeStr) || PAGE_SIZE.DEFAULT,
      sortBy,
      orderBy,
    });

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
    [KEYWORDS.sorting.sort_by]: sortBy,
    [KEYWORDS.sorting.order_by]: orderBy,
    [KEYWORDS.filter.search]: search,
    ...rest
  } = Object.fromEntries(searchParams.entries());

  try {
    const data = await searchProducts({
      search,
      filter: rest,
      page: Number(pageStr) || 1,
      size: Number(sizeStr) || PAGE_SIZE.DEFAULT,
      sortBy,
      orderBy,
    });

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
