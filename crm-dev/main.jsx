import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AGDigitalCRM from "../src/ag-digital-crm.jsx";

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const raw = localStorage.getItem(key);
      return raw != null ? { value: raw } : null;
    },
    async set(key, value) {
      localStorage.setItem(key, value);
    },
  };
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AGDigitalCRM />
  </StrictMode>
);
