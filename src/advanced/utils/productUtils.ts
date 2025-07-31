import { LOW_STOCK_THRESHOLD, LOW_TOTAL_STOCK_THRESHOLD, OUT_OF_STOCK } from '@/const/stock';
import { Product } from '@/data/product';

export const isOutOfStock = (quantity: number) => {
  return quantity === OUT_OF_STOCK;
};

export const isLowTotalStock = (totalStock: number) => {
  return totalStock < LOW_TOTAL_STOCK_THRESHOLD;
};

export const isLowStock = (itemStock: number) => {
  return itemStock < LOW_STOCK_THRESHOLD;
};

export const getTotalStock = (productList: Product[]) => {
  return productList.reduce((totalStock, currentProduct) => totalStock + currentProduct.quantity, 0);
};

export const formatLowStockMessage = (productList: Product[]) => {
  return productList
    .filter(({ quantity }) => isLowStock(quantity))
    .map(({ name, quantity }) =>
      quantity > OUT_OF_STOCK ? `${name}: 재고 부족 (${quantity}개 남음)` : `${name}: 품절`
    )
    .join('\n');
};

export const formatOptionMessage = (product: Product) => {
  const baseText = `${product.name} - ${product.discountPrice}원`;

  if (isOutOfStock(product.quantity)) {
    const suffix = product.onSale ? ' ⚡SALE' : product.suggestSale ? ' 💝추천' : '';
    return `${baseText} (품절)${suffix}`;
  }

  if (product.onSale && product.suggestSale) {
    return `⚡💝 ${baseText} (25% SUPER SALE!)`;
  }

  if (product.onSale) {
    return `⚡ ${product.name} - ${product.price}원 → ${product.discountPrice}원 (20% SALE!)`;
  }

  if (product.suggestSale) {
    return `💝 ${product.name} - ${product.price}원 → ${product.discountPrice}원 (5% 추천할인!)`;
  }

  return baseText;
};

export const getDiscountIconAndColor = (product: Product) => {
  let icon = '';
  let priceColor = '';
  if (product.onSale && product.suggestSale) {
    icon = '⚡💝';
    priceColor = 'text-purple-600';
  } else if (product.onSale) {
    icon = '⚡';
    priceColor = 'text-red-500';
  } else if (product.suggestSale) {
    icon = '💝';
    priceColor = 'text-blue-500';
  }
  return { icon, priceColor };
};

export const toProductOption = (product: Product) => ({
  id: product.id,
  message: formatOptionMessage(product),
  disabled: isOutOfStock(product.quantity),
});
