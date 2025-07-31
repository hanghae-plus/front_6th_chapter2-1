// src/advanced/components/ProductSelector.tsx
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Product } from '../types';
import { STOCK } from '../../basic/constants';

const getOptionClassName = (item: Product): string => {
  if (item.onSale && item.suggestSale) return 'text-purple-600 font-bold';
  if (item.onSale) return 'text-red-500 font-bold';
  if (item.suggestSale) return 'text-blue-500 font-bold';
  if (item.q === 0) return 'text-gray-400';
  return '';
};

const getOptionText = (item: Product): string => {
  const saleText = item.onSale ? '⚡' : '';
  const suggestText = item.suggestSale ? '💝' : '';
  const combinedText = `${saleText}${suggestText}`;

  if (item.q === 0) return `${item.name} - ${item.val}원 (품절)`;
  
  if (item.onSale || item.suggestSale) {
    return `${combinedText}${item.name} - ${item.originalVal}원 → ${item.val}원`;
  }
  
  return `${item.name} - ${item.val}원`;
};

export function ProductSelector() {
  const { state, dispatch } = useCart();
  const { products } = state;
  const [selectedProductId, setSelectedProductId] = useState<string>(products.find(p => p.q > 0)?.id || '');

  const totalStock = products.reduce((sum, p) => sum + p.q, 0);
  const stockWarning = totalStock < STOCK.TOTAL_STOCK_WARNING_THRESHOLD;

  const handleAddToCart = () => {
    if (!selectedProductId) return;
    dispatch({ type: 'ADD_TO_CART', payload: { productId: selectedProductId } });
  };

  const lowStockProducts = products.filter(p => p.q > 0 && p.q < STOCK.LOW_STOCK_THRESHOLD);

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        aria-label="상품 선택"
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
        className={`w-full p-3 border rounded-lg text-base mb-3 ${stockWarning ? 'border-orange-500' : 'border-gray-300'}`}
        id="product-select"
      >
        {products.map((item) => (
          <option key={item.id} value={item.id} disabled={item.q === 0} className={getOptionClassName(item)}>
            {getOptionText(item)}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddToCart}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        id="add-to-cart"
      >
        Add to Cart
      </button>
      {lowStockProducts.length > 0 && (
        <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
          {lowStockProducts.map(p => `${p.name}: 재고 부족 (${p.q}개 남음)`).join('\n')}
        </div>
      )}
    </div>
  );
}