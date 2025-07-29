import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const appContainer = document.getElementById('app');

if (appContainer) {
  ReactDOM.createRoot(appContainer).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
