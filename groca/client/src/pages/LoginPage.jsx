import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await login(form);
      navigate(location.state?.from || "/");
    } catch (error) {
      toast.error(error.response?.data?.message || t("toastLoginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form className="card space-y-4 p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold text-slate-800">{t("login")}</h1>
        <input className="input" placeholder={t("email")} required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input
          className="input"
          placeholder={t("password")}
          required
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn-primary w-full" disabled={loading} type="submit">
          {loading ? t("signingIn") : t("signIn")}
        </button>
        <p className="text-sm text-slate-600">
          {t("noAccount")} <Link className="font-semibold text-brand-primary" to="/register">{t("register")}</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
