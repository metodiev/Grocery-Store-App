import ProductCard from "./ProductCard";
import SkeletonCard from "./ui/SkeletonCard";
import EmptyState from "./ui/EmptyState";

const ProductGrid = ({ products, loading, title = "Products" }) => {
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
        <EmptyState title="No products found" description="Try updating your filters or search query." />
      )}
    </section>
  );
};

export default ProductGrid;
