import {
  PRODUCT_KEYBOARD,
  PRODUCT_MOUSE,
  PRODUCT_MONITOR_ARM,
  PRODUCT_LAPTOP_POUCH,
  PRODUCT_SPEAKER,
} from '../constants/constants';
import { Product } from '../types';

export const getInitialProducts = (): Product[] => [
  {
    id: PRODUCT_KEYBOARD,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    availableStock: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_MOUSE,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    availableStock: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    availableStock: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_LAPTOP_POUCH,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    availableStock: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_SPEAKER,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    val: 25000,
    originalVal: 25000,
    availableStock: 10,
    onSale: false,
    suggestSale: false,
  },
];

export const getProductById = (
  products: Product[],
  id: string,
): Product | undefined => products.find((product) => product.id === id);

export const getTotalStock = (products: Product[]): number =>
  products.reduce((total, product) => total + product.availableStock, 0);

export const getStockWarnings = (products: Product[]) =>
  products
    .filter((product) => product.availableStock < 5)
    .map((product) => ({
      productName: product.name,
      stock: product.availableStock,
      isOutOfStock: product.availableStock === 0,
    }));

export const getProductDisplayText = (product: Product): string => {
  let discountText = '';

  if (product.onSale) discountText += ' ⚡SALE';
  if (product.suggestSale) discountText += ' 💝추천';

  if (product.availableStock === 0) {
    return `${product.name} - ${product.val}원 (품절)${discountText}`;
  }

  if (product.onSale && product.suggestSale) {
    return `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
  }
  if (product.onSale) {
    return `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
  }
  if (product.suggestSale) {
    return `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
  }
  return `${product.name} - ${product.val}원${discountText}`;
};

export const getProductDisplayClassName = (product: Product): string => {
  if (product.availableStock === 0) {
    return 'text-gray-400';
  }

  if (product.onSale && product.suggestSale) {
    return 'text-purple-600 font-bold';
  }
  if (product.onSale) {
    return 'text-red-500 font-bold';
  }
  if (product.suggestSale) {
    return 'text-blue-500 font-bold';
  }

  return '';
};
