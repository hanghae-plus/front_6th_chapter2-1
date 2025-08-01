import React from 'react';
import { Product } from '../../types';
import { CURRENCY_SYMBOL } from '../../constants';
import { useTimer } from '../../contexts/TimerContext';
import { getDiscountType } from '../../utils/discountUtils';
import StockStatus from './StockStatus';
import { DiscountIcon } from '../common';

interface ProductSelectorProps {
  products: ReadonlyArray<Product>;
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  onAddToCart: () => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  onProductSelect,
  onAddToCart,
}) => {
  const { timerState, updateLastSelectedProduct } = useTimer();

  // 전체 재고 계산
  const totalStock = products.reduce(
    (sum, product) => sum + product.stockQuantity,
    0
  );
  const isLowTotalStock = totalStock < 50;

  // 상품 선택 핸들러
  const handleProductSelect = (productId: string) => {
    onProductSelect(productId);
    updateLastSelectedProduct(productId);
  };

  // 선택된 상품의 할인 상태 확인
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const discountType = getDiscountType(
    selectedProductId,
    timerState.flashSaleProductId,
    timerState.recommendationProductId
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">상품 선택</h2>
      <div className="space-y-4">
        <div className="relative">
          <select
            value={selectedProductId}
            onChange={(e) => handleProductSelect(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isLowTotalStock ? 'border-orange-500' : 'border-gray-300'
            }`}
          >
            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
                disabled={product.stockQuantity === 0}
              >
                {product.name} - {CURRENCY_SYMBOL}
                {product.price.toLocaleString()}
              </option>
            ))}
          </select>

          {/* 할인 아이콘 표시 */}
          {discountType && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <DiscountIcon discountType={discountType} />
            </div>
          )}
        </div>

        {/* 선택된 상품 정보 */}
        {selectedProduct && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">
                {selectedProduct.name}
              </h3>
              {discountType && <DiscountIcon discountType={discountType} />}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {CURRENCY_SYMBOL}
                {selectedProduct.price.toLocaleString()}
              </span>
              <StockStatus product={selectedProduct} />
            </div>
          </div>
        )}

        <button
          onClick={onAddToCart}
          disabled={selectedProduct?.stockQuantity === 0}
          className={`w-full py-3 px-6 rounded-lg transition-colors font-semibold ${
            selectedProduct?.stockQuantity === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {selectedProduct?.stockQuantity === 0 ? '품절' : '장바구니에 추가'}
        </button>
      </div>
    </div>
  );
};

export default ProductSelector;
