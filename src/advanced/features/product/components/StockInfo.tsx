import React from 'react';
import { Product } from '../../../shared/types';
import { STOCK_THRESHOLDS } from '../../../shared/constants';

interface StockInfoProps {
  products: Product[];
}

export function StockInfo({ products }: StockInfoProps) {
  const getStockMessage = (): string => {
    const lowStockProducts = products.filter(
      (product) => product.stock > 0 && product.stock <= STOCK_THRESHOLDS.LOW
    );

    const outOfStockProducts = products.filter(
      (product) => product.stock === 0
    );

    const messages: string[] = [];

    // 재고 부족 상품
    if (lowStockProducts.length > 0) {
      lowStockProducts.forEach((product) => {
        messages.push(`${product.name}: 재고 부족 (${product.stock}개 남음)`);
      });
    }

    // 품절 상품
    if (outOfStockProducts.length > 0) {
      outOfStockProducts.forEach((product) => {
        messages.push(`${product.name}: 품절`);
      });
    }

    return messages.join('\n');
  };

  const stockMessage = getStockMessage();

  if (!stockMessage) {
    return null;
  }

  return (
    <div
      id="stock-status"
      className="text-xs text-red-500 mt-3 whitespace-pre-line"
    >
      {stockMessage}
    </div>
  );
}
