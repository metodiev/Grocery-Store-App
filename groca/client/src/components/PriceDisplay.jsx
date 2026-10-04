import { formatCurrency } from "../utils/formatters";

const PriceDisplay = ({ price, discountPrice, className = "" }) => {
  const hasDiscount = discountPrice && Number(discountPrice) < Number(price);

  if (!hasDiscount) {
    return <span className={`text-brand-dark font-bold ${className}`}>{formatCurrency(price)}</span>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-bold text-brand-primary">{formatCurrency(discountPrice)}</span>
      <span className="text-sm text-slate-400 line-through">{formatCurrency(price)}</span>
    </div>
  );
};

export default PriceDisplay;
