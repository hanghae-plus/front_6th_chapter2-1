import { useState } from 'react';

import { useCart } from '../../contexts/CartContext';
import { PRODUCTS } from '../../lib/product';
import { Product } from '../../lib/product';

const ProductPicker = () => {
  const { products, addToCart, setSelectedProduct } = useCart();
  const [selectedProduct, setSelectedProductLocal] = useState<string>('');

  const handleProductSelect = (productId: string, event?: React.ChangeEvent<HTMLSelectElement>) => {
    event?.stopPropagation();
    setSelectedProductLocal(productId);
    setSelectedProduct(productId);
  };

  const handleAddToCart = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (selectedProduct) {
      addToCart(selectedProduct);
    }
  };

  const getProductDisplayName = (product: Product) => {
    const baseName = product.name;
    const originalPrice = product.price.toLocaleString();
    const currentPrice = Math.round(product.price * (1 - product.discount)).toLocaleString();

    let displayName = '';
    let discountText = '';

    // 할인 상태에 따른 텍스트 추가
    if (product.lightningSale && product.recommendationSale) {
      discountText = '⚡💝';
      displayName = `${discountText}${baseName} - ${originalPrice}원 → ${currentPrice}원 (25% SUPER SALE!)`;
    } else if (product.lightningSale) {
      discountText = '⚡';
      displayName = `${discountText}${baseName} - ${originalPrice}원 → ${currentPrice}원 (20% SALE!)`;
    } else if (product.recommendationSale) {
      discountText = '💝';
      displayName = `${discountText}${baseName} - ${originalPrice}원 → ${currentPrice}원 (5% 추천할인!)`;
    } else {
      displayName = `${baseName} - ${currentPrice}원`;
    }

    // 품절 상태 확인
    if (product.stock === 0) {
      displayName += ' (품절)';
    }

    return displayName;
  };

  const getProductClassName = (product: Product) => {
    if (product.stock === 0) {
      return 'text-gray-400';
    }

    if (product.lightningSale && product.recommendationSale) {
      return 'text-purple-600 font-bold';
    } else if (product.lightningSale) {
      return 'text-red-500 font-bold';
    } else if (product.recommendationSale) {
      return 'text-blue-500 font-bold';
    }

    return '';
  };

  const getStockWarningMessage = () => {
    const lowStockProducts = products.filter((product) => product.stock < 5 && product.stock > 0);
    const outOfStockProducts = products.filter((product) => product.stock === 0);

    let message = '';

    lowStockProducts.forEach((product) => {
      message += `${product.name}: 재고 부족 (${product.stock}개 남음)\n`;
    });

    outOfStockProducts.forEach((product) => {
      message += `${product.name}: 품절\n`;
    });

    return message;
  };

  const getTotalStock = () => {
    return products.reduce((total, product) => total + product.stock, 0);
  };

  const totalStock = getTotalStock();
  const stockWarningMessage = getStockWarningMessage();

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className={`w-full p-3 border rounded-lg text-base mb-3 ${
          totalStock < 50 ? 'border-orange-500' : 'border-gray-300'
        }`}
        value={selectedProduct}
        onChange={(e) => handleProductSelect(e.target.value, e)}
      >
        <option value="">상품을 선택하세요</option>
        {PRODUCTS.map((product) => (
          <option
            key={product.id}
            value={product.id}
            className={getProductClassName(product)}
            disabled={product.stock === 0}
          >
            {getProductDisplayName(product)}
          </option>
        ))}
      </select>
      <button
        id="add-to-cart"
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        disabled={!selectedProduct}
      >
        Add to Cart
      </button>
      <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        {stockWarningMessage}
      </div>
    </div>
  );
};

export default ProductPicker;
