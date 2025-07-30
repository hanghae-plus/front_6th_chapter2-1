/**
 * 상품 선택 컴포넌트 - 기본과제 DOM 구조 유지
 */

import React, { useState } from 'react';
import { useCart } from '../../app/providers/CartProvider';
import { usePromotion } from '../../app/providers/PromotionProvider';
import { BUSINESS_CONSTANTS } from '../../shared/constants';

export const ProductSelector: React.FC = () => {
  const { products, addToCart } = useCart();
  const { setLastSelectedProduct } = usePromotion();
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setLastSelectedProduct(productId);
  };

  const handleAddToCart = () => {
    if (selectedProductId) {
      addToCart(selectedProductId);
    }
  };

  const totalStock = products.reduce((sum, product) => sum + product.q, 0);
  const lowStockProducts = products.filter(p => p.q > 0 && p.q < BUSINESS_CONSTANTS.LOW_STOCK_THRESHOLD);
  const outOfStockProducts = products.filter(p => p.q === 0);

  const getProductOptionText = (product: any) => {
    let text = `${product.name} - ${product.val.toLocaleString()}원`;
    
    if (product.q === 0) {
      text += ' (품절)';
    } else if (product.q < BUSINESS_CONSTANTS.LOW_STOCK_THRESHOLD) {
      text += ` (재고부족: ${product.q}개)`;
    }

    // 할인 표시
    if (product.onSale) {
      text += ' ⚡';
    }
    if (product.suggestSale) {
      text += ' 💡';
    }

    return text;
  };

  // 재고 상태 메시지 생성 (기본과제와 동일)
  const getStockStatusMessage = () => {
    let message = '';
    
    if (lowStockProducts.length > 0) {
      const lowStockNames = lowStockProducts.map(p => p.name).join(', ');
      message += `재고 부족: ${lowStockNames}\n`;
    }
    
    if (outOfStockProducts.length > 0) {
      const outOfStockNames = outOfStockProducts.map(p => p.name).join(', ');
      message += `품절: ${outOfStockNames}\n`;
    }
    
    if (totalStock < BUSINESS_CONSTANTS.STOCK_WARNING_THRESHOLD) {
      message += '전체 재고가 부족합니다!';
    }
    
    return message;
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        value={selectedProductId}
        onChange={(e) => handleProductSelect(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      >
        <option value="">상품을 선택하세요</option>
        {products.map((product) => (
          <option 
            key={product.id} 
            value={product.id}
            disabled={product.q === 0}
          >
            {getProductOptionText(product)}
          </option>
        ))}
      </select>
      
      <button
        id="add-to-cart"
        onClick={handleAddToCart}
        disabled={!selectedProductId || products.find(p => p.id === selectedProductId)?.q === 0}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add to Cart
      </button>
      
      <div 
        id="stock-status" 
        className="text-xs text-red-500 mt-3 whitespace-pre-line"
      >
        {getStockStatusMessage()}
      </div>
    </div>
  );
};