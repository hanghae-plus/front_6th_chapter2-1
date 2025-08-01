import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

/**
 * React 앱 엔트리 포인트
 *
 * 기존 main.basic.ts의 DOM 조작 방식에서
 * React createRoot 패턴으로 변환
 */
function main() {
  const container = document.getElementById("app");
  if (!container) {
    throw new Error("App container not found");
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

/**
 * 앱 시작
 */
main();
