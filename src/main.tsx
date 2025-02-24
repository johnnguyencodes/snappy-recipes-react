import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "../index.css";

// Set global variable for development mode to add the `debug-screens` class to the body
window.__APP_ENV__ = import.meta.env.MODE;
if (import.meta.env.MODE === "development") {
  document.body.classList.add("debug-screens");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
