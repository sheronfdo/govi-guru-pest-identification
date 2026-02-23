import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    localStorage.removeItem("gg_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token");
    window.location.href = "/";
  }
  return response;
};

createRoot(document.getElementById("root")!).render(<App />);
