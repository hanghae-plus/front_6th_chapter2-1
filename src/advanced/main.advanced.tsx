import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// 루트 요소 찾기
const rootElement = document.getElementById('app');
if (!rootElement) {
  throw new Error('Root element not found');
}

// React 앱 렌더링
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);