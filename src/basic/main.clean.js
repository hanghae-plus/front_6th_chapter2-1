import { ShoppingCartApp } from "./App.js";

// 애플리케이션 인스턴스 생성
const app = new ShoppingCartApp();

// DOM이 로드된 후 애플리케이션 초기화
document.addEventListener("DOMContentLoaded", () => {
  app.init();
});

// 전역 객체에 앱 인스턴스 노출 (디버깅용)
window.shoppingCartApp = app;
