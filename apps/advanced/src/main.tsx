import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const rootElement = document.getElementById("app");

if (!rootElement) {
	throw new Error('Root element with id "app" not found');
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>
);
