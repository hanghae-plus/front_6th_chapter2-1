// 비즈니스 로직 import
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


// 전역 변수 선언
// 상태 관리 변수
let prodList: Product[] = [];
let cart: Cart = {}; // 장바구니 모델 { productId: quantity }
let lastSel: string | null = null;

interface UseProductsReturn {
  products: Product[];
  totalStock: number;
  getProductById: (id: string) => Product | undefined;
  getStockInfo: () => StockInfo;
  hasLowStock: () => boolean;
  setProducts: (newProducts: Product[]) => void;
}

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

export function useLastSelected(): UseLastSelectedReturn {
  return {
    lastSel: lastSel,
    setLastSel: (value: string | null): void => {
      lastSel = value;
    }
  };
}
