import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link className="card group block overflow-hidden p-4 transition hover:-translate-y-1" to={`/categories/${category.slug}`}>
      <img alt={category.name} className="h-32 w-full rounded-xl object-cover" src={category.image} />
      <h3 className="mt-3 font-semibold text-slate-800 group-hover:text-brand-primary">{category.name}</h3>
      <p className="mt-1 text-xs text-slate-500">Browse fresh {category.name.toLowerCase()}</p>
    </Link>
  );
};

export default CategoryCard;
