import { useLanguage } from "../hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-brand-secondary/20 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h4 className="text-xl font-bold text-brand-dark">Groca</h4>
          <p className="mt-3 text-sm text-slate-600">{t("footerDesc")}</p>
        </div>
        <div>
          <h5 className="font-semibold text-slate-800">{t("company")}</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>{t("aboutUs")}</li>
            <li>{t("careers")}</li>
            <li>{t("contact")}</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-slate-800">{t("help")}</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>{t("trackOrder")}</li>
            <li>{t("returnPolicy")}</li>
            <li>{t("shippingInfo")}</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-slate-800">{t("newsletter")}</h5>
          <p className="mt-3 text-sm text-slate-600">{t("newsletterSmall")}</p>
        </div>
      </div>
      <p className="border-t border-brand-secondary/15 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} Groca. {t("rightsReserved")}</p>
    </footer>
  );
};

export default Footer;
