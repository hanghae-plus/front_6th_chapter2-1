import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider, useCart } from "./context/CartContext";
import { Layout } from "./components/Layout";
import { useSpecialEvents } from "./hooks/useSpecialEvents";
import { INITIAL_PRODUCTS } from "./constants";
import { Product } from "./types";

const App = () => {
  const { state, updateProducts } = useCart();
  const { products } = state;

  // 초기 상품 데이터 설정
  useEffect(() => {
    if (products.length === 0) {
      updateProducts(INITIAL_PRODUCTS);
    }
  }, [updateProducts, products.length]);

  // 특별 이벤트 훅 사용
  useSpecialEvents({
    products,
    onProductUpdate: (productId: string, updates: Partial<Product>) => {
      const updatedProducts = products.map(product => (product.id === productId ? { ...product, ...updates } : product));
      updateProducts(updatedProducts);
    },
    selectedProductId: state.selectedProductId,
  });

  return <Layout />;
};

const AppWithContext: React.FC = () => {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
};

// DOM에 렌더링
const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(<AppWithContext />);
}
