import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { setupGlobalErrorLogging } from "@/lib/logger";

setupGlobalErrorLogging();

createRoot(document.getElementById("root")!).render(
	<ErrorBoundary componentName="RootApp">
		<App />
	</ErrorBoundary>
);
