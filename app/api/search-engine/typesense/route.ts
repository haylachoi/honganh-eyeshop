import {
  createBlogsCollection,
  deleteBlogCollection,
  populateBlogsCollection,
} from "@/features/fts/typesense/blog/blog.service";
import {
  createProductCollection,
  deleteProductCollection,
  populateProductsCollection,
} from "@/features/fts/typesense/product/product.service";
import { checkHealth } from "@/features/fts/typesense/typesense.utils";
import { NextRequest, NextResponse } from "next/server";

const actionHandlers: Record<string, Record<string, () => Promise<void>>> = {
  create: {
    products: createProductCollection,
    blogs: createBlogsCollection,
  },
  populate: {
    products: populateProductsCollection,
    blogs: populateBlogsCollection,
  },
  delete: {
    products: deleteProductCollection,
    blogs: deleteBlogCollection,
  },
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { action, collection } = body;

  try {
    // Health check không cần collection
    if (action === "health") {
      const health = await checkHealth();
      return NextResponse.json({ success: true, health });
    }

    const collectionHandlers = actionHandlers[action];
    if (!collectionHandlers) {
      return NextResponse.json(
        { success: false, message: `Unknown action: ${action}` },
        { status: 400 },
      );
    }

    const handler = collectionHandlers[collection];
    if (!handler) {
      return NextResponse.json(
        { success: false, message: `Unknown collection: ${collection}` },
        { status: 400 },
      );
    }

    await handler();

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: (e as Error).message },
      { status: 500 },
    );
  }
};
