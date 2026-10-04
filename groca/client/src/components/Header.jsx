import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import SearchBar from "./SearchBar";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../hooks/useLanguage";
import { useTheme } from "../hooks/useTheme";

const Header = ({ search, setSearch, onSearchSubmit }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const themeItems = [
    { key: "green", label: t("themeGreen") },
    { key: "ocean", label: t("themeOcean") },
    { key: "sunset", label: t("themeSunset") },
    { key: "berry", label: t("themeBerry") }
  ];

  const links = [
    { to: "/", label: t("navHome") },
    { to: "/shop", label: t("navShop") },
    { to: "/orders", label: t("navOrders") }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-brand-secondary/20 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link className="flex items-center gap-2" to="/">
          <div className="h-10 w-10 rounded-xl bg-brand-primary p-2 text-center text-xl font-bold text-white">G</div>
          <div>
            <p className="text-xl font-extrabold text-brand-dark">Groca</p>
            <p className="text-xs text-slate-500">{t("tagline")}</p>
          </div>
        </Link>

        <div className="hidden flex-1 px-8 md:block">
          <SearchBar value={search} onChange={setSearch} onSubmit={onSearchSubmit} />
        </div>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-brand-dark" : "text-slate-600 hover:text-brand-primary"}`
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1">
            <span className="text-xs font-semibold text-slate-500">{t("theme")}</span>
            <select
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
              onChange={(event) => setTheme(event.target.value)}
              value={theme}
            >
              {themeItems.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 p-1">
            <button
              className={`rounded-lg px-2 py-1 text-xs font-semibold ${language === "en" ? "bg-brand-primary text-white" : "text-slate-600"}`}
              onClick={() => setLanguage("en")}
              type="button"
            >
              EN
            </button>
            <button
              className={`rounded-lg px-2 py-1 text-xs font-semibold ${language === "bg" ? "bg-brand-primary text-white" : "text-slate-600"}`}
              onClick={() => setLanguage("bg")}
              type="button"
            >
              BG
            </button>
          </div>

          <button
            className="relative rounded-xl border border-brand-secondary/30 p-2 text-slate-600 hover:bg-brand-secondary/10"
            onClick={() => navigate("/cart")}
            type="button"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-brand-primary px-1.5 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link className="rounded-xl bg-brand-secondary/10 px-3 py-2 text-sm font-semibold text-brand-dark" to="/profile">
                {user?.name?.split(" ")[0] || t("profile")}
              </Link>
              {user?.role === "ADMIN" && (
                <Link className="btn-secondary" to="/admin">
                  {t("admin")}
                </Link>
              )}
              <button className="btn-primary" onClick={logout} type="button">
                {t("logout")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link className="btn-secondary" to="/login">
                {t("login")}
              </Link>
              <Link className="btn-primary" to="/register">
                {t("register")}
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsMobileOpen((prev) => !prev)} type="button">
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="space-y-4 border-t border-brand-secondary/20 bg-white px-4 py-4 md:hidden">
          <div className="space-y-2 rounded-xl border border-slate-200 p-3">
            <p className="text-xs font-semibold uppercase text-slate-500">{t("theme")}</p>
            <div className="flex flex-wrap gap-2">
              {themeItems.map((item) => (
                <button
                  className={`theme-chip ${theme === item.key ? "theme-chip-active" : ""}`}
                  key={item.key}
                  onClick={() => setTheme(item.key)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`rounded-lg px-3 py-1 text-xs font-semibold ${language === "en" ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-700"}`}
              onClick={() => setLanguage("en")}
              type="button"
            >
              EN
            </button>
            <button
              className={`rounded-lg px-3 py-1 text-xs font-semibold ${language === "bg" ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-700"}`}
              onClick={() => setLanguage("bg")}
              type="button"
            >
              BG
            </button>
          </div>
          <SearchBar value={search} onChange={setSearch} onSubmit={onSearchSubmit} />
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-secondary/10" key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-secondary/10" to="/cart">
              {t("cart")} ({itemCount})
            </Link>
            {isAuthenticated ? (
              <>
                <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-secondary/10" to="/profile">
                  {t("profile")}
                </Link>
                {user?.role === "ADMIN" && (
                  <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-secondary/10" to="/admin">
                    {t("admin")}
                  </Link>
                )}
                <button className="btn-primary" onClick={logout} type="button">
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link className="btn-secondary text-center" to="/login">
                  {t("login")}
                </Link>
                <Link className="btn-primary text-center" to="/register">
                  {t("register")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
