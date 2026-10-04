import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";

const MainLayout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const setSearch = (value) => {
    const query = value ? `?search=${encodeURIComponent(value)}` : "";
    navigate(`/shop${query}`);
  };

  return (
    <div className="page-shell min-h-screen">
      <Header
        onSearchSubmit={(event) => {
          event.preventDefault();
        }}
        search={search}
        setSearch={setSearch}
      />
      <main className="page-main mx-auto mt-4 max-w-7xl px-4 py-8 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
