import React from 'react';
import { Product } from '../types';

interface ProductSelectorProps {
  products: Product[];
  selectedProduct: string;
  onProductSelect: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProduct,
  onProductSelect,
  onAddToCart
}) => {
  const totalStock = products.reduce((sum, product) => sum + product.q, 0);
  const lowStockProducts = products.filter(product => product.q < 5 && product.q > 0);
  const outOfStockProducts = products.filter(product => product.q === 0);

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className={`w-full p-3 border rounded-lg text-base mb-3 ${
          totalStock < 50 ? 'border-orange-500' : 'border-gray-300'
        }`}
        value={selectedProduct}
        onChange={(e) => onProductSelect(e.target.value)}
      >
        <option value="">상품을 선택하세요</option>
        {products.map((product) => {
          let discountText = '';
          if (product.onSale) discountText += ' ⚡SALE';
          if (product.suggestSale) discountText += ' 💝추천';

          if (product.q === 0) {
            return (
              <option key={product.id} value={product.id} disabled className="text-gray-400">
                {product.name} - {product.val}원 (품절){discountText}
              </option>
            );
          }

          let optionText = '';
          let optionClassName = '';

          if (product.onSale && product.suggestSale) {
            optionText = `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
            optionClassName = 'text-purple-600 font-bold';
          } else if (product.onSale) {
            optionText = `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
            optionClassName = 'text-red-500 font-bold';
          } else if (product.suggestSale) {
            optionText = `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
            optionClassName = 'text-blue-500 font-bold';
          } else {
            optionText = `${product.name} - ${product.val}원${discountText}`;
          }

          return (
            <option key={product.id} value={product.id} className={optionClassName}>
              {optionText}
            </option>
          );
        })}
      </select>

      <button
        id="add-to-cart"
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={() => selectedProduct && onAddToCart(selectedProduct)}
        disabled={!selectedProduct}
      >
        Add to Cart
      </button>

      <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        {lowStockProducts.map(product => 
          `${product.name}: 재고 부족 (${product.q}개 남음)\n`
        )}
        {outOfStockProducts.map(product => 
          `${product.name}: 품절\n`
        )}
      </div>
    </div>
  );
}; 