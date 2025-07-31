import {
  DISCOUNT_ITEM_BULK_THRESHOLD,
  ITEM_LOW_STOCK_THRESHOLD,
  TOTAL_LOW_STOCK_THRESHOLD,
} from '../constants/quantity';

type QuantityInput = number | { quantity: number };

export function getTotalCount(data: { quantity: number }[]) {
  return data.reduce((acc, curr) => acc + curr.quantity, 0);
}

export function isSoldOut(data: QuantityInput) {
  if (typeof data === 'number') {
    return data === 0;
  }

  return data.quantity === 0;
}

export function isItemLowStock(data: QuantityInput) {
  const quantity = typeof data === 'number' ? data : data.quantity;

  return !isSoldOut(data) && quantity < ITEM_LOW_STOCK_THRESHOLD;
}

export function isItemBulk(data: QuantityInput) {
  if (typeof data === 'number') {
    return data >= DISCOUNT_ITEM_BULK_THRESHOLD;
  }

  return data.quantity >= DISCOUNT_ITEM_BULK_THRESHOLD;
}

export function isTotalLowStock(
  data: number | { quantity: number }[]
): boolean {
  if (Array.isArray(data)) {
    return getTotalCount(data) < TOTAL_LOW_STOCK_THRESHOLD;
  }

  if (typeof data === 'number') {
    return data < TOTAL_LOW_STOCK_THRESHOLD;
  }

  throw new Error('Invalid data type');
}

export function formatQuantity({ quantity }: { quantity: number }) {
  return Intl.NumberFormat('ko-KR').format(quantity);
}
