import { CURRENCY_SYMBOL } from '../constants';

export function formatCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString()}`;
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(0)}%`;
}

export function formatStock(stock: number): string {
  if (stock === 0) return '품절';
  return `재고: ${stock}개`;
}
