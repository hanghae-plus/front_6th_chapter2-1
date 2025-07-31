import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './src/index.css';
import App from './src/App.tsx';

const rootElement = document.getElementById('app');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
