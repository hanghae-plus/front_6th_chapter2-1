import { createRoot } from "react-dom/client";
import App from "./components/App";

/**
 * React 앱 진입점
 */
const container = document.getElementById("app");
if (!container) {
  throw new Error("App container not found");
}

const root = createRoot(container);
root.render(<App />);
