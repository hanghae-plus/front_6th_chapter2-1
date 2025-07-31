import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';

function main() {
  const rootElement = document.getElementById('app');

  if (!rootElement) {
    console.error('Root element not found, retrying...');
    setTimeout(main, 100);
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// DOM이 로드된 후 앱 마운트
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
