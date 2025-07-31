import {
  DISCOUNT_RATE_LIGHTNING,
  DISCOUNT_RATE_SUGGESTION,
  DISCOUNT_RATE_SUPER_SALE,
} from '@/advanced/data/discount.data';
import { Product, ProductStatus } from '@/advanced/types/product.type';
import { getProductStatusIcon } from '@/advanced/utils/cart.util';

export function getProductStatus(product: Product): ProductStatus {
  if (product.stock === 0) return ProductStatus.OUT_OF_STOCK;
  if (product.onSale && product.suggestSale) return ProductStatus.SUPER_SALE;
  if (product.onSale) return ProductStatus.LIGHTNING_SALE;
  if (product.suggestSale) return ProductStatus.SUGGESTION_SALE;
  return ProductStatus.NORMAL;
}

export function createProductText(product: Product): string {
  const status: ProductStatus = getProductStatus(product);

  const sufix = {
    [ProductStatus.OUT_OF_STOCK]: '(품절)',
    [ProductStatus.SUPER_SALE]: `(${DISCOUNT_RATE_SUPER_SALE}% SUPER SALE!)`,
    [ProductStatus.LIGHTNING_SALE]: `(${DISCOUNT_RATE_LIGHTNING}% SALE!)`,
    [ProductStatus.SUGGESTION_SALE]: `(${DISCOUNT_RATE_SUGGESTION}% 추천할인!)`,
    [ProductStatus.NORMAL]: '',
  };

  const formatters = {
    [ProductStatus.OUT_OF_STOCK]: () =>
      `${product.name} - ${product.price}원 ${sufix[ProductStatus.OUT_OF_STOCK]}`,
    [ProductStatus.SUPER_SALE]: () =>
      `${getProductStatusIcon(product)}${product.name} - ${product.originalPrice}원 → ${product.price}원 ${sufix[ProductStatus.SUPER_SALE]}`,
    [ProductStatus.LIGHTNING_SALE]: () =>
      `${getProductStatusIcon(product)}${product.name} - ${product.originalPrice}원 → ${product.price}원 ${sufix[ProductStatus.LIGHTNING_SALE]}`,
    [ProductStatus.SUGGESTION_SALE]: () =>
      `${getProductStatusIcon(product)}${product.name} - ${product.originalPrice}원 → ${product.price}원 ${sufix[ProductStatus.SUGGESTION_SALE]}`,
    [ProductStatus.NORMAL]: () => `${product.name} - ${product.price}원`,
  };

  return formatters[status]();
}
