// utils/formatters.ts
import type { Product, ProductOptionFormat } from '../types/index.js';

export function formatPrice(price: number): string {
  return `₩${Math.round(price).toLocaleString()}`;
}

export function formatDiscountRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function formatStockMessage(productName: string, stock: number): string {
  if (stock === 0) {
    return `${productName}: 품절`;
  } else if (stock < 5) {
    return `${productName}: 재고 부족 (${stock}개 남음)`;
  }
  return '';
}

export function formatItemCount(count: number): string {
  return `🛍️ ${count} items in cart`;
}

export function formatPoints(points: number): string {
  return `${points}p`;
}

function determinePriceColorClass(onSale: boolean, recommendSale: boolean): string {
  if (onSale && recommendSale) return 'text-purple-600';
  if (onSale) return 'text-red-500';
  if (recommendSale) return 'text-blue-500';
  return '';
}

export function formatProductPrice(product: Product): string {
  if (!product.onSale && !product.recommendSale) {
    return formatPrice(product.price);
  }

  const colorClass = determinePriceColorClass(
    product.onSale,
    product.recommendSale,
  );
  const originalHtml = `<span class="line-through text-gray-400">${formatPrice(product.originalPrice)}</span>`;
  const salePriceHtml = `<span class="${colorClass}">${formatPrice(product.price)}</span>`;

  return `${originalHtml} ${salePriceHtml}`;
}

export function formatProductName(product: Product): string {
  let saleIcon = '';

  if (product.onSale && product.recommendSale) {
    saleIcon = '⚡💝';
  } else if (product.onSale) {
    saleIcon = '⚡';
  } else if (product.recommendSale) {
    saleIcon = '💝';
  }
  return saleIcon + product.name;
}

export function formatProductOption(product: Product): ProductOptionFormat {
  let text = `${product.name} - ${product.price}원`;
  let className = '';

  if (product.stock === 0) {
    text += ' (품절)';
    className = 'text-gray-400';
  } else if (product.onSale && product.recommendSale) {
    text = `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`;
    className = 'text-purple-600 font-bold';
  } else if (product.onSale) {
    text = `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`;
    className = 'text-red-500 font-bold';
  } else if (product.recommendSale) {
    text = `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)`;
    className = 'text-blue-500 font-bold';
  }

  return { text, className };
}