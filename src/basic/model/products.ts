const SALE_EVENT = {
  NONE: 0x0,
  LIGHTNING: 0x1,
  SUGGEST: 0x2,
  ALL: 0x3,
};

const NONE_SALE_RATE = 0;
const LIGHTNING_SALE_RATE = 0.2;
const SUGGEST_SALE_RATE = 0.1;
const ALL_SALE_RATE = 0.25;

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

export function findProduct(id: string): Product | null {
  return products.find((product) => product.id === id) ?? null;
}

export function getProductCount(): number {
  return products.length;
}

export function isLightningSale(saleEvent: number): boolean {
  return (saleEvent & SALE_EVENT.LIGHTNING) === SALE_EVENT.LIGHTNING;
}

export function isSuggestSale(saleEvent: number): boolean {
  return (saleEvent & SALE_EVENT.SUGGEST) === SALE_EVENT.SUGGEST;
}

export function isAllSale(saleEvent: number): boolean {
  return (saleEvent & SALE_EVENT.ALL) === SALE_EVENT.ALL;
}

export function hasLightningSale(product: Product): boolean {
  return isLightningSale(product.saleEvent);
}

export function hasSuggestSale(product: Product): boolean {
  return isSuggestSale(product.saleEvent);
}

export function hasAllSale(product: Product): boolean {
  return isAllSale(product.saleEvent);
}

function getSaleRate(saleEvent: number): number {
  if (isAllSale(saleEvent)) {
    return ALL_SALE_RATE;
  }

  if (isLightningSale(saleEvent)) {
    return LIGHTNING_SALE_RATE;
  }

  if (isSuggestSale(saleEvent)) {
    return SUGGEST_SALE_RATE;
  }

  return NONE_SALE_RATE;
}

function applySale(productId: string, saleEvent: number): void {
  products = products.map((product) => {
    const nextSaleEvent =
      product.id === productId
        ? product.saleEvent | saleEvent
        : product.saleEvent;

    return {
      ...product,
      price: product.price * (1 - getSaleRate(nextSaleEvent)),
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

export function isSoldOut(product: Product): boolean {
  return product.quantity === 0;
}

export function isLowStock(product: Product): boolean {
  const LOW_STOCK_THRESHOLD = 5;
  return !isSoldOut(product) && product.quantity < LOW_STOCK_THRESHOLD;
}

export function isBulk(product: Product): boolean {
  const BULK_THRESHOLD = 10;
  return product.quantity >= BULK_THRESHOLD;
}
