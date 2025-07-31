import { OUT_OF_STOCK } from '@/const/stock';
import { Product } from '@/data/product';

export const isOutOfStock = (quantity: number) => {
  return quantity === OUT_OF_STOCK;
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

export const toProductOption = (product: Product) => ({
  id: product.id,
  message: formatOptionMessage(product),
  disabled: isOutOfStock(product.quantity),
});
