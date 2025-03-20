import ProductsView from "@/app/admin/products/_components/products-view";
import MainPageHeading from "@/components/shared/admin/main-page-heading";
import AdminMainTopSection from "@/components/shared/admin/main-top-section";
import { Button } from "@/components/ui/button";
import { ADMIN_ENDPOINTS } from "@/constants";
import { getAllProducts } from "@/features/products/product.query";
import Link from "next/link";

const ProductPage = async () => {
  const result = await getAllProducts();

  if (!result.success) {
    return <div>Error</div>;
  }

  const products = result.data;

  return (
    <div>
      <AdminMainTopSection
        title="Danh sách hàng hóa"
        addNewLink={`${ADMIN_ENDPOINTS.PRODUCTS}/create`}
      />
      <ProductsView products={products} />
    </div>
  );
};

export default ProductPage;
