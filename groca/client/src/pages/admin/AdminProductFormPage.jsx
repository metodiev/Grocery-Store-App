import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getCategoriesRequest } from "../../services/categoryService";
import { createProductRequest, getProductRequest, updateProductRequest } from "../../services/productService";

const initialForm = {
  name: "",
  description: "",
  price: 0,
  discountPrice: "",
  image: "",
  stock: 0,
  unit: "kg",
  categoryId: "",
  isFeatured: false,
  isActive: true
};

const AdminProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategoriesRequest().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEdit) {
      return;
    }
    getProductRequest(id).then((product) => {
      setForm({
        name: product.name,
        description: product.description,
        price: Number(product.price),
        discountPrice: product.discountPrice || "",
        image: product.image,
        stock: product.stock,
        unit: product.unit,
        categoryId: product.categoryId,
        isFeatured: product.isFeatured,
        isActive: product.isActive
      });
    });
  }, [id, isEdit]);

  const onSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice === "" ? null : Number(form.discountPrice),
      stock: Number(form.stock)
    };

    try {
      setLoading(true);
      if (isEdit) {
        await updateProductRequest(id, payload);
        toast.success("Product updated");
      } else {
        await createProductRequest(payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card space-y-4 p-6" onSubmit={onSubmit}>
      <h1 className="text-2xl font-bold text-slate-800">{isEdit ? "Edit product" : "New product"}</h1>
      <input className="input" placeholder="Product name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <textarea className="input min-h-24" placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="grid gap-3 sm:grid-cols-3">
        <input className="input" min="0" placeholder="Price" required step="0.01" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="input" min="0" placeholder="Discount price" step="0.01" type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
        <input className="input" min="0" placeholder="Stock" required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
      </div>
      <input className="input" placeholder="Image URL" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="input" placeholder="Unit" required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
        <select className="input" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-5">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input checked={form.isFeatured} type="checkbox" onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input checked={form.isActive} type="checkbox" onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Active
        </label>
      </div>
      <button className="btn-primary" disabled={loading} type="submit">
        {loading ? "Saving..." : "Save product"}
      </button>
    </form>
  );
};

export default AdminProductFormPage;
