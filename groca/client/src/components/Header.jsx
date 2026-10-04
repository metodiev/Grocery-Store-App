import { Menu, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import SearchBar from "./SearchBar";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const Header = ({ search, setSearch, onSearchSubmit }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/orders", label: "Orders" }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-green-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link className="flex items-center gap-2" to="/">
          <div className="h-10 w-10 rounded-xl bg-brand-primary p-2 text-center text-xl font-bold text-white">G</div>
          <div>
            <p className="text-xl font-extrabold text-brand-dark">Groca</p>
            <p className="text-xs text-slate-500">Fresh groceries fast</p>
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
          <button
            className="relative rounded-xl border border-green-100 p-2 text-slate-600 hover:bg-green-50"
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
              <Link className="rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-brand-dark" to="/profile">
                {user?.name?.split(" ")[0] || "Profile"}
              </Link>
              {user?.role === "ADMIN" && (
                <Link className="btn-secondary" to="/admin">
                  Admin
                </Link>
              )}
              <button className="btn-primary" onClick={logout} type="button">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link className="btn-secondary" to="/login">
                Login
              </Link>
              <Link className="btn-primary" to="/register">
                Register
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsMobileOpen((prev) => !prev)} type="button">
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="space-y-4 border-t border-green-100 bg-white px-4 py-4 md:hidden">
          <SearchBar value={search} onChange={setSearch} onSubmit={onSearchSubmit} />
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-green-50" key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-green-50" to="/cart">
              Cart ({itemCount})
            </Link>
            {isAuthenticated ? (
              <>
                <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-green-50" to="/profile">
                  Profile
                </Link>
                {user?.role === "ADMIN" && (
                  <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-green-50" to="/admin">
                    Admin
                  </Link>
                )}
                <button className="btn-primary" onClick={logout} type="button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn-secondary text-center" to="/login">
                  Login
                </Link>
                <Link className="btn-primary text-center" to="/register">
                  Register
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
