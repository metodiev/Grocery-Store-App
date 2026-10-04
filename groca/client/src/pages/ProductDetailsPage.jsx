import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductGrid from "../components/ProductGrid";
import PriceDisplay from "../components/PriceDisplay";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { getProductRequest } from "../services/productService";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductRequest(id);
        setProduct(data);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <LoadingSpinner className="h-12 w-12" />;
  }

  if (!product) {
    return <p className="text-center text-red-500">Product not found.</p>;
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="space-y-12">
      <section className="card grid gap-8 p-6 lg:grid-cols-2">
        <img alt={product.name} className="h-[420px] w-full rounded-2xl object-cover" src={product.image} />
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">{product.category?.name}</p>
          <h1 className="text-3xl font-extrabold text-slate-800">{product.name}</h1>
          <p className="text-slate-600">{product.description}</p>
          <PriceDisplay className="text-2xl" price={product.price} discountPrice={product.discountPrice} />
          <p className={outOfStock ? "text-red-500" : "text-green-700"}>
            {outOfStock ? "Out of stock" : `In stock: ${product.stock} ${product.unit}`}
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700" htmlFor="quantity">
              Quantity
            </label>
            <input
              className="input w-24"
              id="quantity"
              max={product.stock}
              min={1}
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </div>
          <button
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={outOfStock || !isAuthenticated}
            onClick={() => addToCart(product.id, quantity)}
            type="button"
          >
            {isAuthenticated ? "Add to cart" : "Login to add"}
          </button>
        </div>
      </section>

      <ProductGrid loading={false} products={product.relatedProducts || []} title="Related products" />
    </div>
  );
};

export default ProductDetailsPage;
