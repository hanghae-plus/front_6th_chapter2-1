/**
 * 상태 관리 훅
 * React hook 패턴을 차용한 vanilla JS 상태 관리
 */
import {
  calculateCartData,
  calculatePoints,
  calculateTotalStock,
  getStockInfo,
  type Cart,
  type Product,
  type CartData,
  type PointsData,
  type StockInfo
} from './entities.js'


/**
 * 전역 상태
 * 요구사항: 상품 목록, 장바구니, 마지막 선택 상품 추적
 */
let prodList: Product[] = [];
let cart: Cart = {};
let lastSel: string | null = null;

interface UseProductsReturn {
  products: Product[];
  totalStock: number;
  getProductById: (id: string) => Product | undefined;
  getStockInfo: () => StockInfo;
  hasLowStock: () => boolean;
  setProducts: (newProducts: Product[]) => void;
}

/**
 * 상품 목록 관리 훅
 * 요구사항: 상품 정보 조회, 재고 확인, 상품 업데이트
 */
export function useProducts(): UseProductsReturn {
  return {
    products: prodList,
    totalStock: calculateTotalStock(prodList),

    getProductById: (id: string): Product | undefined => prodList.find(p => p.id === id),
    getStockInfo: (): StockInfo => getStockInfo(prodList),
    hasLowStock: (): boolean => calculateTotalStock(prodList) < 50,

    setProducts: (newProducts: Product[]): void => {
      prodList = newProducts;
    }
  };
}

interface UseCartReturn {
  cart: Cart;
  cartData: CartData;
  pointsData: PointsData;
  isEmpty: boolean;
  getItemQuantity: (productId: string) => number;
  hasItem: (productId: string) => boolean;
  setCart: (newCart: Cart) => void;
}

/**
 * 장바구니 관리 훅
 * 요구사항: 장바구니 상태, 금액 계산, 포인트 계산
 */
export function useCart(): UseCartReturn {
  const cartData = calculateCartData(cart, prodList, new Date());
  const pointsData = calculatePoints(cartData, cart, new Date());

  return {
    cart: cart,
    cartData: cartData,
    pointsData: pointsData,
    isEmpty: Object.keys(cart).length === 0,
    getItemQuantity: (productId: string): number => cart[productId] || 0,
    hasItem: (productId: string): boolean => productId in cart,

    setCart: (newCart: Cart): void => {
      cart = newCart;
    }
  };
}

interface UseLastSelectedReturn {
  lastSel: string | null;
  setLastSel: (value: string | null) => void;
}

/**
 * 마지막 선택 상품 추적 훅
 * 요구사항: 추천 할인을 위한 마지막 선택 상품 기록
 */
export function useLastSelected(): UseLastSelectedReturn {
  return {
    lastSel: lastSel,
    setLastSel: (value: string | null): void => {
      lastSel = value;
    }
  };
}
