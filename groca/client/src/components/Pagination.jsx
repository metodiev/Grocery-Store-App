import { useLanguage } from "../hooks/useLanguage";

const Pagination = ({ page, totalPages, onChange }) => {
  const { t } = useLanguage();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        type="button"
      >
        {t("prev")}
      </button>
      <span className="text-sm font-semibold text-slate-700">
        {t("pageOf", { page, totalPages })}
      </span>
      <button
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        type="button"
      >
        {t("next")}
      </button>
    </div>
  );
};

export default Pagination;
