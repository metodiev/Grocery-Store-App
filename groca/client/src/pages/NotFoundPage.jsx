import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="card flex flex-col items-center gap-4 p-12 text-center">
      <h1 className="text-5xl font-extrabold text-brand-dark">404</h1>
      <p className="text-slate-600">The page you are looking for does not exist.</p>
      <Link className="btn-primary" to="/">
        Go home
      </Link>
    </div>
  );
};

export default NotFoundPage;
