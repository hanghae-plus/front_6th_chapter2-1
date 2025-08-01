import React, { useState } from 'react';
import { Product } from '../types';
import { getTotalStock } from '../utils/product';

interface ProductSelectorProps {
  productList: Product[];
  onAddToCart: (productId: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ productList, onAddToCart }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const totalStock = getTotalStock(productList);

  const handleAddToCart = () => {
    if (selectedProductId) {
      onAddToCart(selectedProductId);
    }
  };

  return (
    <div className='mb-6 pb-6 border-b border-gray-200'>
      <select
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
        className='w-full p-3 border border-gray-300 rounded-lg text-base mb-3'
        style={{ borderColor: totalStock < 50 ? 'orange' : '' }}
      >
        <option value=''>상품을 선택하세요</option>
        {productList.map((product) => {
          const badge = product.isOnSale ? ' ⚡SALE' : product.isRecommended ? ' 💝추천' : '';

          if (product.quantity === 0) {
            return (
              <option key={product.id} value={product.id} disabled className='text-gray-400'>
                {product.name} - {product.price}원 (품절){badge}
              </option>
            );
          }

          if (product.isOnSale && product.isRecommended) {
            return (
              <option key={product.id} value={product.id} className='text-purple-600 font-bold'>
                ⚡💝{product.name} - {product.originalPrice}원 → {product.price}원 (25% SUPER SALE!)
              </option>
            );
          }

          if (product.isOnSale) {
            return (
              <option key={product.id} value={product.id} className='text-red-500 font-bold'>
                ⚡{product.name} - {product.originalPrice}원 → {product.price}원 (20% SALE!)
              </option>
            );
          }

          if (product.isRecommended) {
            return (
              <option key={product.id} value={product.id} className='text-blue-500 font-bold'>
                💝{product.name} - {product.originalPrice}원 → {product.price}원 (5% 추천할인!)
              </option>
            );
          }

          return (
            <option key={product.id} value={product.id}>
              {product.name} - {product.price}원{badge}
            </option>
          );
        })}
      </select>

      <button
        onClick={handleAddToCart}
        className='w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all'
      >
        Add to Cart
      </button>

      <div className='text-xs text-red-500 mt-3 whitespace-pre-line'>
        {productList
          .filter((item) => item.quantity < 5)
          .map((item) =>
            item.quantity > 0
              ? `${item.name}: 재고 부족 (${item.quantity}개 남음)`
              : `${item.name}: 품절`,
          )
          .join('\n')}
      </div>
    </div>
  );
};

export default ProductSelector;
