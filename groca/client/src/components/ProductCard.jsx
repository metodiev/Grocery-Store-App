import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import PriceDisplay from "./PriceDisplay";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../hooks/useLanguage";
import { localizeCategoryName, localizeProduct } from "../utils/catalogLocalization";

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const localizedProduct = localizeProduct(product, language);
  const localizedCategoryName = localizeCategoryName(product.category, language);

  const isOutOfStock = product.stock <= 0;

  return (
    <article className="card group overflow-hidden transition hover:-translate-y-1">
      <Link to={`/products/${product.id}`}>
        <img alt={localizedProduct.name} className="h-48 w-full object-cover" src={localizedProduct.image} />
      </Link>
      <div className="space-y-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">{localizedCategoryName}</p>
        <Link className="line-clamp-1 text-base font-bold text-slate-800 group-hover:text-brand-dark" to={`/products/${product.id}`}>
          {localizedProduct.name}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-500">{localizedProduct.description}</p>
        <div className="flex items-center justify-between">
          <PriceDisplay price={product.price} discountPrice={product.discountPrice} />
          <span className={`text-xs font-semibold ${isOutOfStock ? "text-red-500" : "text-green-700"}`}>
            {isOutOfStock ? t("outOfStock") : t("inStock", { stock: product.stock, unit: localizedProduct.unit })}
          </span>
        </div>
        <button
          className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isOutOfStock || !isAuthenticated}
          onClick={() => addToCart(product.id, 1)}
          type="button"
        >
          <ShoppingCart className="h-4 w-4" />
          {isAuthenticated ? t("addToCart") : t("loginToAdd")}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
