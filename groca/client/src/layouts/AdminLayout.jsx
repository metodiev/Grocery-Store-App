import { BarChart3, Boxes, ListOrdered, Tags, Users } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ListOrdered },
  { to: "/admin/users", label: "Users", icon: Users }
];

const AdminLayout = () => {
  return (
    <div className="admin-shell grid min-h-screen lg:grid-cols-[260px_1fr]">
      <aside className="admin-aside border-r p-6">
        <Link className="text-2xl font-extrabold text-brand-dark" to="/">
          Groca Admin
        </Link>
        <nav className="mt-8 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                className={({ isActive }) =>
                  `admin-nav-item flex items-center gap-2 px-3 py-2 text-sm font-semibold ${
                    isActive ? "admin-nav-item-active text-brand-dark" : "text-slate-600"
                  }`
                }
                key={link.to}
                to={link.to}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
