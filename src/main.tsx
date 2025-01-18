import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
        <ToastContainer position="bottom-right" autoClose={5000} closeButton={true} pauseOnHover={true} />
    </React.StrictMode>
);