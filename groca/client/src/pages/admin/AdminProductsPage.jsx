import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { deleteProductRequest, getProductsRequest } from "../../services/productService";
import { formatCurrency } from "../../utils/formatters";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const data = await getProductsRequest({ limit: 100 });
    setProducts(data.items);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    await deleteProductRequest(id);
    toast.success("Product deleted");
    fetchProducts();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <Link className="btn-primary" to="/admin/products/new">
          Add product
        </Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="border-b border-slate-100" key={product.id}>
                <td className="px-4 py-3 font-semibold text-slate-700">{product.name}</td>
                <td className="px-4 py-3">{formatCurrency(product.discountPrice || product.price)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">{product.isActive ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link className="btn-secondary" to={`/admin/products/${product.id}/edit`}>
                      Edit
                    </Link>
                    <button className="rounded-xl border border-red-200 px-3 py-2 text-red-600" onClick={() => deleteProduct(product.id)} type="button">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;
