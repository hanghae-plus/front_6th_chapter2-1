import React, { useState } from 'react';
import { ProductSelector } from './components/ProductSelector';
import { useProducts } from './hooks/useProducts';
import './App.css';

function App() {
  const { products, lowStockProducts, outOfStockProducts } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState('');

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 좌측: 상품 선택 및 장바구니 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">상품 선택</h2>
              <ProductSelector
                products={products}
                selectedProductId={selectedProductId}
                onProductSelect={handleProductSelect}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">장바구니</h2>
              <p className="text-gray-600">장바구니 기능이 여기에 들어갈 예정입니다.</p>
            </div>
          </div>

          {/* 우측: 주문 요약 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">주문 요약</h2>
              <p className="text-gray-600">주문 요약 기능이 여기에 들어갈 예정입니다.</p>
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
