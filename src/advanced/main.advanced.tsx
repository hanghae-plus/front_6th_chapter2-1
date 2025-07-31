import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { CartProvider } from './store/CaratContext';
import { ProductProvider } from './store/ProductContext';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);

root.render(
  <React.StrictMode>
    <ProductProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductProvider>
  </React.StrictMode>
);
