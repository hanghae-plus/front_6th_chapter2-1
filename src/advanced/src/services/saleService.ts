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
    quantity: 50,
  },
  {
    id: 'p2',
    name: '생산성 폭발 마우스',
    originalPrice: 20000,
    price: 20000,
    saleIcon: '',
    quantity: 30,
  },
  {
    id: 'p3',
    name: '거북목 탈출 모니터암',
    originalPrice: 30000,
    price: 30000,
    saleIcon: '',
    quantity: 20,
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
    quantity: 10,
  },
];

let updateProductCallbacks: ProductUpdateCallback[] = [];
let selectedProductId: string | null = null;

export function addProductUpdateCallback(callback: ProductUpdateCallback) {
  updateProductCallbacks.push(callback);
}

// 기존 함수 호환성을 위해 유지 (deprecated)
export function setProductUpdateCallback(callback: ProductUpdateCallback) {
  updateProductCallbacks = [callback];
}

export function setSelectedProduct(productId: string) {
  selectedProductId = productId;
}

export function getSelectedProduct(): string | null {
  return selectedProductId;
}

function updateProduct(productId: string, updates: Partial<Product>) {
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex >= 0) {
    products[productIndex] = { ...products[productIndex], ...updates };
    updateProductCallbacks.forEach(callback => callback(products));
  }
}

export function decreaseProductStock(productId: string, amount: number = 1) {
  const product = products.find((p) => p.id === productId);
  if (product && product.quantity >= amount) {
    updateProduct(productId, { quantity: product.quantity - amount });
    return true;
  }
  return false;
}

export function increaseProductStock(productId: string, amount: number = 1) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    updateProduct(productId, { quantity: product.quantity + amount });
    return true;
  }
  return false;
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

export function startSuggestSale() {
  const suggestDelay = Math.random() * TIMER_DELAYS.SUGGEST.DELAY_MAX;

  setTimeout(() => {
    setInterval(() => {
      if (selectedProductId) {
        // 선택된 상품이 아닌 다른 상품 중에서 추천 대상 찾기
        const suggestCandidate = products.find(product => 
          product.id !== selectedProductId &&
          product.quantity > 0 &&
          !product.isSuggestSale
        );

        if (suggestCandidate) {
          const newPrice = Math.round(suggestCandidate.price * (1 - DISCOUNT_RATES.SUGGEST));
          
          updateProduct(suggestCandidate.id, {
            price: newPrice,
            isSuggestSale: true,
            saleIcon: suggestCandidate.saleIcon + '💝'
          });
          
          alert(`💝 ${suggestCandidate.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        }
      }
    }, TIMER_DELAYS.SUGGEST.INTERVAL);
  }, suggestDelay);
}

export function getProducts() {
  return products;
}
