import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { currentUserRequest, loginRequest, registerRequest } from "../services/authService";
import { useLanguage } from "../hooks/useLanguage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await currentUserRequest();
      setUser(currentUser);
    } catch (_error) {
      localStorage.removeItem("groca_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("groca_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCurrentUser();
  }, []);

  const login = async (payload) => {
    const data = await loginRequest(payload);
    localStorage.setItem("groca_token", data.token);
    setUser(data.user);
    toast.success(t("toastWelcomeBack"));
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    localStorage.setItem("groca_token", data.token);
    setUser(data.user);
    toast.success(t("toastAccountCreated"));
  };

  const logout = () => {
    localStorage.removeItem("groca_token");
    setUser(null);
    toast.success(t("toastLoggedOut"));
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
      refreshUser: fetchCurrentUser
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
