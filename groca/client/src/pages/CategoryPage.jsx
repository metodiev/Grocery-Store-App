import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductGrid from "../components/ProductGrid";
import { getProductsRequest } from "../services/productService";

const CategoryPage = () => {
  const { slug } = useParams();
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

  const title = slug
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

  return <ProductGrid loading={loading} products={products} title={title} />;
};

export default CategoryPage;
