import PriceDisplay from "./PriceDisplay";
import { useLanguage } from "../hooks/useLanguage";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const { t } = useLanguage();

  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <img alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" src={item.product.image} />
        <div>
          <h3 className="font-semibold text-slate-800">{item.product.name}</h3>
          <p className="text-sm text-slate-500">{item.product.unit}</p>
          <PriceDisplay className="mt-1" price={item.product.price} discountPrice={item.product.discountPrice} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-lg border border-slate-200 px-3 py-1" onClick={onDecrease} type="button">
          -
        </button>
        <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
        <button className="rounded-lg border border-slate-200 px-3 py-1" onClick={onIncrease} type="button">
          +
        </button>
        <button className="rounded-lg border border-red-100 px-3 py-1 text-red-600" onClick={onRemove} type="button">
          {t("remove")}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
