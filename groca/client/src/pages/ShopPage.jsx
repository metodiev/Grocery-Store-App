import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Pagination from "../components/Pagination";
import ProductGrid from "../components/ProductGrid";
import { useLanguage } from "../hooks/useLanguage";
import { getCategoriesRequest } from "../services/categoryService";
import { getProductsRequest } from "../services/productService";

const ShopPage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const filters = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sort: searchParams.get("sort") || "newest"
    }),
    [searchParams]
  );

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== "page") {
      next.set("page", "1");
    }
    setSearchParams(next);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productData, categoryData] = await Promise.all([
          getProductsRequest({ ...filters, limit: 12 }),
          getCategoriesRequest()
        ]);
        setProducts(productData.items);
        setPagination(productData.pagination);
        setCategories(categoryData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="card h-fit space-y-4 p-4">
        <h3 className="text-lg font-bold text-slate-800">{t("filters")}</h3>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">{t("category")}</label>
          <select className="input" value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
            <option value="">{t("allCategories")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">{t("minPrice")}</label>
            <input
              className="input"
              min="0"
              type="number"
              value={filters.minPrice}
              onChange={(event) => updateFilter("minPrice", event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">{t("maxPrice")}</label>
            <input
              className="input"
              min="0"
              type="number"
              value={filters.maxPrice}
              onChange={(event) => updateFilter("maxPrice", event.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">{t("sort")}</label>
          <select className="input" value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
            <option value="newest">{t("newest")}</option>
            <option value="price_asc">{t("priceLowHigh")}</option>
            <option value="price_desc">{t("priceHighLow")}</option>
            <option value="name_asc">{t("nameAZ")}</option>
          </select>
        </div>
      </aside>

      <div className="space-y-6">
        <ProductGrid loading={loading} products={products} title={t("allGroceryProducts")} />
        <Pagination page={pagination.page || 1} totalPages={pagination.totalPages || 1} onChange={(page) => updateFilter("page", String(page))} />
      </div>
    </div>
  );
};

export default ShopPage;
