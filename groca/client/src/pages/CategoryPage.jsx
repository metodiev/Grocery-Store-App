import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductGrid from "../components/ProductGrid";
import { useLanguage } from "../hooks/useLanguage";
import { getProductsRequest } from "../services/productService";
import { localizeCategoryName } from "../utils/catalogLocalization";

const CategoryPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsRequest({ category: slug, limit: 24 });
        setProducts(data.items || []);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  const title = localizeCategoryName(slug, language);

  return <ProductGrid loading={loading} products={products} title={title} />;
};

export default CategoryPage;
