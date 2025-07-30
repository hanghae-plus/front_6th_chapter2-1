import { TIMER_DELAYS, DISCOUNT_RATES } from '../constants/shopPolicy';

export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  saleIcon: string;
  quantity: number;
  isLightningSale?: boolean;
  isSuggestSale?: boolean;
}

// 상품 업데이트 콜백 타입
type ProductUpdateCallback = (products: Product[]) => void;

const products: Product[] = [
  {
    id: 'p1',
    name: '버그 없애는 키보드',
    originalPrice: 10000,
    price: 10000,
    saleIcon: '',
    quantity: 100,
  },
  {
    id: 'p2',
    name: '생산성 폭발 마우스',
    originalPrice: 20000,
    price: 20000,
    saleIcon: '',
    quantity: 100,
  },
  {
    id: 'p3',
    name: '거북목 탈출 모니터암',
    originalPrice: 30000,
    price: 30000,
    saleIcon: '',
    quantity: 100,
  },
  {
    id: 'p4',
    name: '에러 방지 노트북 파우치',
    originalPrice: 15000,
    price: 15000,
    saleIcon: '',
    quantity: 0,
  },
  {
    id: 'p5',
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    originalPrice: 25000,
    price: 25000,
    saleIcon: '',
    quantity: 100,
  },
];

let updateProductCallback: ProductUpdateCallback | null = null;

export function setProductUpdateCallback(callback: ProductUpdateCallback) {
  updateProductCallback = callback;
}

function updateProduct(productId: string, updates: Partial<Product>) {
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex >= 0) {
    products[productIndex] = { ...products[productIndex], ...updates };
    updateProductCallback?.(products);
  }
}

export function startLightningSale() {
  const lightningDelay = Math.random() * TIMER_DELAYS.LIGHTNING.DELAY_MAX;

  setTimeout(() => {
    setInterval(() => {
      const availableProducts = products.filter(
        (p) => p.quantity > 0 && !p.isLightningSale
      );

      if (availableProducts.length > 0) {
        const luckyIdx = Math.floor(Math.random() * availableProducts.length);
        const luckyItem = availableProducts[luckyIdx];

        const newPrice = Math.round(
          luckyItem.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING)
        );

        updateProduct(luckyItem.id, {
          price: newPrice,
          isLightningSale: true,
          saleIcon: '⚡',
        });

        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING * 100}% 할인 중입니다!`
        );
      }
    }, TIMER_DELAYS.LIGHTNING.INTERVAL);
  }, lightningDelay);
}

export function getProducts() {
  return products;
}
