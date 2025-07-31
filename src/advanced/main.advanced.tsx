import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

// DOM 요소 확인
const container = document.getElementById('app');
if (!container) {
  throw new Error('Root element with id "app" not found');
}

// React 18의 createRoot API 사용
const root = createRoot(container);

// 애플리케이션 렌더링
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('🛒 Hanghae Online Store (React + TypeScript) 초기화 완료!');