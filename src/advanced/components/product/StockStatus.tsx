import React from 'react';
import { Product } from '../../types';
import { PRODUCT_CONSTANTS } from '../../constants';

interface StockStatusProps {
  product: Product;
  className?: string;
}

const StockStatus: React.FC<StockStatusProps> = ({
  product,
  className = '',
}) => {
  const getStockStatus = () => {
    const { stockQuantity } = product;

    if (stockQuantity === 0) {
      return {
        text: '품절',
        className: 'text-red-600 font-semibold',
        icon: '❌',
      };
    }
    if (stockQuantity <= PRODUCT_CONSTANTS.LOW_STOCK_THRESHOLD) {
      return {
        text: `재고 부족 (${stockQuantity}개)`,
        className: 'text-orange-600 font-semibold',
        icon: '⚠️',
      };
    }
    if (stockQuantity <= PRODUCT_CONSTANTS.STOCK_WARNING_THRESHOLD) {
      return {
        text: `재고 적음 (${stockQuantity}개)`,
        className: 'text-yellow-600 font-semibold',
        icon: '⚠️',
      };
    }
    return {
      text: `재고 있음 (${stockQuantity}개)`,
      className: 'text-green-600 font-semibold',
      icon: '✅',
    };
  };

  const { text, className: statusClassName, icon } = getStockStatus();

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <span className="text-sm">{icon}</span>
      <span className={`text-sm ${statusClassName}`}>{text}</span>
    </div>
  );
};

export default StockStatus;
