import React, { useState } from 'react';
import { ProductSelector } from './components/ProductSelector';
import { Cart } from './components/Cart';
import { AddToCartButton } from './components/AddToCartButton';
import { OrderSummary } from './components/OrderSummary';
import { TuesdayBanner } from './components/TuesdayBanner';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { Product } from './types';
import './App.css';

function App() {
  const { products, updateStock, restoreStock, getProduct } = useProducts();
  const {
    cartItems,
    totalItems,
    totalAmount,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [selectedProductId, setSelectedProductId] = useState('');

  const selectedProduct = selectedProductId ? getProduct(selectedProductId) || null : null;

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleAddToCart = (product: Product) => {
    // 재고 확인
    if (product.stock > 0) {
      addToCart(product);
      updateStock(product.id, 1);
      setSelectedProductId(''); // 선택 초기화
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (item) {
      restoreStock(productId, item.quantity);
      removeFromCart(productId);
    }
  };

  const handleIncreaseQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (item && item.product.stock > item.quantity) {
      increaseQuantity(productId);
      updateStock(productId, 1);
    }
  };

  const handleDecreaseQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (item) {
      decreaseQuantity(productId);
      restoreStock(productId, 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">🛒 Hanghae Online Store</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 화요일 할인 배너 */}
        <TuesdayBanner />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 좌측: 상품 선택 및 장바구니 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">상품 선택</h2>
              <div className="space-y-4">
                <ProductSelector
                  products={products}
                  selectedProductId={selectedProductId}
                  onProductSelect={handleProductSelect}
                />
                <AddToCartButton selectedProduct={selectedProduct} onAddToCart={handleAddToCart} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">장바구니</h2>
              <Cart
                cartItems={cartItems}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onRemoveItem={handleRemoveFromCart}
              />
            </div>
          </div>

          {/* 우측: 주문 요약 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <OrderSummary cartItems={cartItems} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">포인트 적립</h2>
              <p className="text-gray-600">포인트 적립 기능이 여기에 들어갈 예정입니다.</p>
            </div>
          </div>
        </div>
      </main>

      {/* 도움말 버튼 */}
      <button className="fixed top-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
        ❓
      </button>
    </div>
  );
}

export default App;
