import ProductCard from "./ProductCard";
import SkeletonCard from "./ui/SkeletonCard";
import EmptyState from "./ui/EmptyState";
import { useLanguage } from "../hooks/useLanguage";

const ProductGrid = ({ products, loading, title = "Products" }) => {
  const { t } = useLanguage();

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      </div>
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState title={t("noProductsFound")} description={t("tryUpdatingFilters")} />
      )}
    </section>
  );
};

export default ProductGrid;
