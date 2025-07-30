"use client";

import { Toaster } from "react-hot-toast";

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#e94560",
            secondary: "#fff",
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: "#e94560",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default Toast;
