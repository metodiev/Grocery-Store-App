import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "./hooks/useAuth";
import ToastProvider from "./components/ui/ToastProvider";
import "./index.css";

const Providers = () => {
  const { isAuthenticated } = useAuth();

  return (
    <CartProvider isAuthenticated={isAuthenticated}>
      <App />
      <ToastProvider />
    </CartProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Providers />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
