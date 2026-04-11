import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/analytics.css";
import "./styles/budget.css";
import "./styles/settings.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);