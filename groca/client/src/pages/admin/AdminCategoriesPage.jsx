import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  createCategoryRequest,
  deleteCategoryRequest,
  getCategoriesRequest,
  updateCategoryRequest
} from "../../services/categoryService";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    const data = await getCategoriesRequest();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    await createCategoryRequest({ name, image: "https://picsum.photos/seed/category-card/800/600" });
    setName("");
    toast.success("Category created");
    fetchCategories();
  };

  const toggleCategoryStatus = async (category) => {
    await updateCategoryRequest(category.id, { isActive: !category.isActive });
    toast.success("Category updated");
    fetchCategories();
  };

  const removeCategory = async (id) => {
    await deleteCategoryRequest(id);
    toast.success("Category deleted");
    fetchCategories();
  };

  return (
    <div className="space-y-5">
      <form className="card flex flex-wrap items-center gap-3 p-5" onSubmit={createCategory}>
        <input className="input max-w-sm" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn-primary" type="submit">
          Add category
        </button>
      </form>

      <div className="card overflow-hidden">
        {categories.map((category) => (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-4" key={category.id}>
            <div>
              <p className="font-semibold text-slate-800">{category.name}</p>
              <p className="text-xs text-slate-500">{category.slug}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => toggleCategoryStatus(category)} type="button">
                {category.isActive ? "Deactivate" : "Activate"}
              </button>
              <button className="rounded-xl border border-red-200 px-3 py-2 text-red-600" onClick={() => removeCategory(category.id)} type="button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
