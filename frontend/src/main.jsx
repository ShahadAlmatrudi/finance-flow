<<<<<<< HEAD
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
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./App.css";
import App from './App.jsx'
>>>>>>> 1bf2e26e0d79a13d3b396cd457f5feca06c7922c

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);