import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Truck, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

import CategoryCard from "../components/CategoryCard";
import ProductGrid from "../components/ProductGrid";
import { useLanguage } from "../hooks/useLanguage";
import { getCategoriesRequest } from "../services/categoryService";
import { getProductsRequest } from "../services/productService";

const HomePage = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [discounted, setDiscounted] = useState([]);
  const [loading, setLoading] = useState(true);

  const features = [
    {
      title: t("whyFastDeliveryTitle"),
      description: t("whyFastDeliveryDesc"),
      icon: Truck
    },
    {
      title: t("whyFreshQualityTitle"),
      description: t("whyFreshQualityDesc"),
      icon: ShieldCheck
    },
    {
      title: t("whyBetterPricesTitle"),
      description: t("whyBetterPricesDesc"),
      icon: Wallet
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryData, featuredData, discountedData] = await Promise.all([
          getCategoriesRequest(),
          getProductsRequest({ featured: true, limit: 8 }),
          getProductsRequest({ discounted: true, limit: 8 })
        ]);

        setCategories(categoryData);
        setFeatured(featuredData.items || []);
        setDiscounted(discountedData.items || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary p-10 text-white">
        <div className="max-w-2xl space-y-5">
          <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">{t("homeBadge")}</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">{t("homeHeroTitle")}</h1>
          <p className="text-sm text-white/90 md:text-base">{t("homeHeroSubtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-dark" to="/shop">
              {t("shopNow")}
            </Link>
            <Link className="rounded-xl border border-white/60 px-5 py-3 text-sm font-bold text-white" to="/categories/fruits-vegetables">
              {t("browseCategories")}
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">{t("featuredCategories")}</h2>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary" to="/shop">
            {t("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.slice(0, 10).map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </div>
      </section>

      <ProductGrid loading={loading} products={featured} title={t("popularProducts")} />
      <ProductGrid loading={loading} products={discounted} title={t("discountProducts")} />

      <section className="grid gap-4 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article className="card p-6" key={feature.title}>
              <Icon className="h-8 w-8 text-brand-primary" />
              <h3 className="mt-4 text-lg font-bold text-slate-800">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </article>
          );
        })}
      </section>

      <section className="card grid gap-6 bg-white p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">{t("newsletterTitle")}</h3>
          <p className="mt-2 text-sm text-slate-600">{t("newsletterDesc")}</p>
        </div>
        <form className="flex w-full max-w-md gap-2">
          <input className="input" placeholder={t("enterEmail")} type="email" />
          <button className="btn-primary" type="button">
            {t("subscribe")}
          </button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
