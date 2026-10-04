import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { localizeCategoryName } from "../utils/catalogLocalization";

const CategoryCard = ({ category }) => {
  const { language, t } = useLanguage();
  const categoryName = localizeCategoryName(category, language);

  return (
    <Link className="card group block overflow-hidden p-4 transition hover:-translate-y-1" to={`/categories/${category.slug}`}>
      <img alt={categoryName} className="h-32 w-full rounded-xl object-cover" src={category.image} />
      <h3 className="mt-3 font-semibold text-slate-800 group-hover:text-brand-primary">{categoryName}</h3>
      <p className="mt-1 text-xs text-slate-500">{t("browseFresh", { category: categoryName.toLowerCase() })}</p>
    </Link>
  );
};

export default CategoryCard;
