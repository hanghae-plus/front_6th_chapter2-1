import { useState, useEffect } from 'react';
import { useCart } from 'context/CartProvider';
import { Product } from 'types';
import { commaizeNumber } from 'utils/commaizeNumberWithIUnit';
import { UI_TEXTS } from 'shared/constants/event';

export function ProductSelector() {
  const { products, stockStatus, addToCart } = useCart();
  const [selectedProductId, setSelectedProductId] = useState('');

  //FIXME: 개선
  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const handleAddToCart = () => {
    if (selectedProductId) {
      addToCart(selectedProductId);
    }
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
      >
        {products.map((product) => (
          <ProductOption key={product.id} product={product} />
        ))}
      </select>

      <button
        id="add-to-cart"
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>

      <div
        id="stock-status"
        className="text-xs text-red-500 mt-3 whitespace-pre-line"
      >
        {stockStatus}
      </div>
    </div>
  );
}

// 상품 상태 판단
const getProductStatus = (product: Product) => {
  const isOutOfStock = product.q <= 0;
  const hasDiscount = product.onSale || product.suggestSale;

  return { isOutOfStock, hasDiscount };
};

// 상품 옵션 컴포넌트
interface ProductOptionProps {
  product: Product;
}

function ProductOption({ product }: ProductOptionProps) {
  const { val, id, name } = product;
  const { isOutOfStock, hasDiscount } = getProductStatus(product);
  const formattedPrice = commaizeNumber(val);

  // 상품 상태별 표시 정보를 한 곳에 정의
  const displayInfo = (() => {
    if (isOutOfStock) {
      return {
        suffix: ` (${UI_TEXTS.stockMessages.outOfStock.split(':')[1].trim()})`,
        disabled: true,
      };
    }
    if (hasDiscount) {
      return { suffix: ' (할인가)', disabled: false };
    }
    return { suffix: '', disabled: false };
  })();

  return (
    <option value={id} disabled={displayInfo.disabled}>
      {name} - ₩{formattedPrice}
      {displayInfo.suffix}
    </option>
  );
}
