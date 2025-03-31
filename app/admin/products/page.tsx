import ProductsView from "@/app/admin/products/_components/products-view";
import AdminMainTopSection from "@/components/shared/admin/main-top-section";
import { ADMIN_ENDPOINTS } from "@/constants";
import { getAllProducts } from "@/features/products/product.query";

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
