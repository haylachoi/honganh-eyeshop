import { ProductType } from "@/features/products/product.types";
import { PreviewCard } from "../product-preview-card";

const ProductsView = ({ products }: { products: ProductType[] }) => {
  return (
    <ul className="grid grid-cols-4 gap-4">
      {products.map((product) => (
        <li key={product.id}>
          <PreviewCard product={product} />
        </li>
      ))}
    </ul>
  );
};

export default ProductsView;
