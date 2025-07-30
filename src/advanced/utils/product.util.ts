import { DISCOUNT_RATE_LIGHTNING, DISCOUNT_RATE_SUGGESTION } from '@/advanced/data/discount.data';
import { Product, ProductStatus } from '@/advanced/types/product.type';
import { getSuperSaleRate } from '@/advanced/utils/discount.util';

export function getProductStatus(product: Product): ProductStatus {
  if (product.stock === 0) return ProductStatus.OUT_OF_STOCK;
  if (product.onSale && product.suggestSale) return ProductStatus.SUPER_SALE;
  if (product.onSale) return ProductStatus.LIGHTNING_SALE;
  if (product.suggestSale) return ProductStatus.SUGGESTION_SALE;
  return ProductStatus.NORMAL;
}

export function createProductText(product: Product): string {
  const status: ProductStatus = getProductStatus(product);

  const discountText = product.onSale ? '⚡SALE' : product.suggestSale ? '💝추천' : '';

  const formatters = {
    [ProductStatus.OUT_OF_STOCK]: () =>
      `${product.name} - ${product.price}원 (품절) ${discountText}`,
    [ProductStatus.SUPER_SALE]: () =>
      `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (${getSuperSaleRate()}% SUPER SALE!)`,
    [ProductStatus.LIGHTNING_SALE]: () =>
      `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (${DISCOUNT_RATE_LIGHTNING}% SALE!)`,
    [ProductStatus.SUGGESTION_SALE]: () =>
      `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (${DISCOUNT_RATE_SUGGESTION}% 추천할인!)`,
    [ProductStatus.NORMAL]: () => `${product.name} - ${product.price}원 ${discountText}`,
  };

  return formatters[status]();
}
