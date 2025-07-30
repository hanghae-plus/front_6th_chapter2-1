import {
  isAllSale,
  isLightningSale,
  isNoneSale,
  isSuggestSale,
  SALE_EVENT,
  saleRate,
} from './sale-event';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  bulkSaleRate: number;
  saleEvent: number;
}

let products: Product[] = [
  {
    id: 'p1',
    name: '버그 없애는 키보드',
    price: 10000,
    originalPrice: 10000,
    quantity: 50,
    bulkSaleRate: 0.25,
    saleEvent: SALE_EVENT.NONE,
  },
  {
    id: 'p2',
    name: '생산성 폭발 마우스',
    price: 20000,
    originalPrice: 20000,
    quantity: 30,
    bulkSaleRate: 0.15,
    saleEvent: SALE_EVENT.NONE,
  },
  {
    id: 'p3',
    name: '거북목 탈출 모니터암',
    price: 30000,
    originalPrice: 30000,
    quantity: 20,
    bulkSaleRate: 0.2,
    saleEvent: SALE_EVENT.NONE,
  },
  {
    id: 'p4',
    name: '에러 방지 노트북 파우치',
    price: 15000,
    originalPrice: 15000,
    quantity: 0,
    bulkSaleRate: 0.05,
    saleEvent: SALE_EVENT.NONE,
  },
  {
    id: 'p5',
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    price: 25000,
    originalPrice: 25000,
    quantity: 10,
    bulkSaleRate: 0.25,
    saleEvent: SALE_EVENT.NONE,
  },
];

export function getProducts(): Product[] {
  return products;
}

export function findProduct(id: string): Product {
  const product = products.find((product) => product.id === id);

  if (!product) {
    throw new Error(`findProduct: ${id} not found`);
  }

  return product;
}

export function getProductCount(): number {
  return products.length;
}

export function hasNoneSale(product: Pick<Product, 'saleEvent'>): boolean {
  return isNoneSale(product.saleEvent);
}

export function hasLightningSale(product: Pick<Product, 'saleEvent'>): boolean {
  return isLightningSale(product.saleEvent);
}

export function hasSuggestSale(product: Pick<Product, 'saleEvent'>): boolean {
  return isSuggestSale(product.saleEvent);
}

export function hasAllSale(product: Pick<Product, 'saleEvent'>): boolean {
  return isAllSale(product.saleEvent);
}

function applySale(productId: string, saleEvent: number): void {
  products = products.map((product) => {
    if (product.id !== productId) {
      return product;
    }

    const nextSaleEvent = product.saleEvent | saleEvent;
    return {
      ...product,
      price: product.price * (1 - saleRate(nextSaleEvent)),
      saleEvent: nextSaleEvent,
    };
  });
}

export function applyLightningSale(productId: string): void {
  applySale(productId, SALE_EVENT.LIGHTNING);
}

export function applySuggestSale(productId: string): void {
  applySale(productId, SALE_EVENT.SUGGEST);
}

export function isSoldOut(product: Pick<Product, 'quantity'>): boolean {
  return product.quantity === 0;
}

export function isLowStock(product: Pick<Product, 'quantity'>): boolean {
  const LOW_STOCK_THRESHOLD = 5;
  return !isSoldOut(product) && product.quantity < LOW_STOCK_THRESHOLD;
}

export function isBulk(product: Pick<Product, 'quantity'>): boolean {
  const BULK_THRESHOLD = 10;
  return product.quantity >= BULK_THRESHOLD;
}

export function addProductQuantity({
  id,
  quantity,
}: Pick<Product, 'id' | 'quantity'>): void {
  products = products.map((product) => {
    if (product.id !== id) {
      return product;
    }

    return { ...product, quantity: product.quantity + quantity };
  });
}

export function getTotalProductQuantity(): number {
  return products.reduce((acc, product) => acc + product.quantity, 0);
}

export function isLowTotalQuantity(): boolean {
  const LOW_TOTAL_QUANTITY_THRESHOLD = 50;
  return getTotalProductQuantity() < LOW_TOTAL_QUANTITY_THRESHOLD;
}
