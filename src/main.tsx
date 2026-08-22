import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { registerPwaServiceWorker } from "./utils/pwaUpdater"

// Initialize PWA Service Worker with lifecycle update listeners
registerPwaServiceWorker()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
