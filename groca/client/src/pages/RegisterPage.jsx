import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await register(form);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || t("toastRegistrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form className="card space-y-4 p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold text-slate-800">{t("createAccount")}</h1>
        <input className="input" placeholder={t("fullName")} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder={t("email")} required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input
          className="input"
          minLength={8}
          placeholder={t("password")}
          required
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input className="input" placeholder={t("phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button className="btn-primary w-full" disabled={loading} type="submit">
          {loading ? t("creatingAccount") : t("register")}
        </button>
        <p className="text-sm text-slate-600">
          {t("alreadyHaveAccount")} <Link className="font-semibold text-brand-primary" to="/login">{t("login")}</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
