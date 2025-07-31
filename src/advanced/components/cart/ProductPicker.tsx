import { useState } from 'react';

import { useCart } from '../../contexts/CartContext';
import { PRODUCTS } from '../../lib/product';
import { Product } from '../../lib/product';

const ProductPicker = () => {
  const {
    products,
    addToCart,
    setSelectedProduct,
    getDiscountStyle,
    lightningSaleProductId,
    recommendationProductId,
  } = useCart();
  const [selectedProduct, setSelectedProductLocal] = useState<string>('');

  const handleProductSelect = (productId: string) => {
    setSelectedProductLocal(productId);
    setSelectedProduct(productId);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct);
    }
  };

  const getStockStatus = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return '';
    return product.stock === 0 ? `${product.name}: 품절` : '';
  };

  const getProductDisplayName = (product: Product) => {
    const discountStyle = getDiscountStyle(product.id);
    const baseName = `${product.name} - ${product.price.toLocaleString()}원`;

    if (discountStyle.icon) {
      return `${discountStyle.icon} ${baseName}`;
    }

    return baseName;
  };

  const getProductClassName = (product: Product) => {
    const discountStyle = getDiscountStyle(product.id);
    return discountStyle.className || '';
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedProduct}
        onChange={(e) => handleProductSelect(e.target.value)}
      >
        <option value="">상품을 선택하세요</option>
        {PRODUCTS.map((product) => (
          <option key={product.id} value={product.id} className={getProductClassName(product)}>
            {getProductDisplayName(product)}
          </option>
        ))}
      </select>
      <button
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        disabled={!selectedProduct}
      >
        Add to Cart
      </button>
      <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        {selectedProduct && getStockStatus(selectedProduct)}
      </div>

      {/* 할인 상태 표시 */}
      {(lightningSaleProductId || recommendationProductId) && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          {lightningSaleProductId && (
            <div className="text-red-600 font-medium">⚡ 번개세일 진행 중!</div>
          )}
          {recommendationProductId && (
            <div className="text-blue-600 font-medium">💝 추천할인 진행 중!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPicker;
