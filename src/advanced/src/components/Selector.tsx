import { useState } from 'react';
import { Product } from '../types/product';
import { STOCK_ALERT } from '../utils/constants';

interface SelectorProps {
  productList: Product[];
  lastSelectedProduct: Product | null;
  onAdd: (productId: string) => void;
}

const Selector = ({
  productList,
  lastSelectedProduct,
  onAdd,
}: SelectorProps) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    lastSelectedProduct?.id || (productList.find((p) => p.stock > 0)?.id ?? '')
  );

  const handleAddClick = () => {
    onAdd(selectedProductId);
  };

  const totalStock = productList.reduce((a, p) => a + p.stock, 0);

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <label htmlFor="product-select" className="sr-only">
        상품 선택
      </label>
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
        style={{ borderColor: totalStock < 50 ? 'orange' : '' }}
      >
        {productList.map((product) => {
          let optionText = `${product.name} - ${product.val.toLocaleString()}원`;
          let optionClass = '';

          if (product.onSale && product.suggestSale) {
            optionText = `⚡💝${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (25% SUPER SALE!)`;
            optionClass = 'text-purple-600 font-bold';
          } else if (product.onSale) {
            optionText = `⚡${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (20% SALE!)`;
            optionClass = 'text-red-500 font-bold';
          } else if (product.suggestSale) {
            optionText = `💝${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (5% 추천할인!)`;
            optionClass = 'text-blue-500 font-bold';
          }

          if (product.stock === 0) {
            optionText = `${product.name} - ${product.val.toLocaleString()}원 (품절)`;
            optionClass = 'text-gray-400';
          }

          return (
            <option
              key={product.id}
              value={product.id}
              disabled={product.stock === 0}
              className={optionClass}
            >
              {optionText}
            </option>
          );
        })}
      </select>
      <button
        id="add-to-cart"
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={handleAddClick}
        disabled={
          !selectedProductId ||
          productList.find((p) => p.id === selectedProductId)?.stock === 0
        }
      >
        Add to Cart
      </button>
      <div
        id="stock-status"
        className="text-xs text-red-500 mt-3 whitespace-pre-line"
      >
        {productList
          .map((p) => {
            if (p.stock === 0) {
              return `${p.name}: 품절`;
            } else if (p.stock < STOCK_ALERT) {
              return `${p.name}: 재고 부족 (${p.stock}개 남음)`;
            }
            return null;
          })
          .filter(Boolean)
          .join('\n')}
      </div>
    </div>
  );
};

export default Selector;
