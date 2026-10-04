import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2600,
        style: {
          borderRadius: "12px",
          border: "1px solid #DCFCE7"
        }
      }}
    />
  );
};

export default ToastProvider;
