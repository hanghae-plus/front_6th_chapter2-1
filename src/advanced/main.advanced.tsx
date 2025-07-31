import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { CartProvider } from './contexts/CartContext';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
);
