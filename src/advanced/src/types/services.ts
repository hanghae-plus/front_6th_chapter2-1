import type { Product, CartItem, CartTotals, PointsCalculation } from "./index";

/**
 * 장바구니 서비스 인터페이스
 */
export interface ICartService {
  addItem(
    productId: string,
    products: Product[],
    cart: CartItem[]
  ): {
    newCart: CartItem[];
    product?: Product;
  };

  updateQuantity(id: string, quantity: number, cart: CartItem[]): CartItem[];

  removeItem(id: string, cart: CartItem[]): CartItem[];

  calculateTotals(cart: CartItem[]): CartTotals;
}

/**
 * 포인트 계산 서비스 인터페이스
 */
export interface IPointService {
  calculatePoints(
    items: CartItem[],
    totalAmount: number,
    totalQty: number,
    isTuesday: boolean
  ): PointsCalculation;
}

/**
 * 재고 관리 서비스 인터페이스
 */
export interface IStockService {
  validateStock(
    productId: string,
    requestedQuantity: number,
    products: Product[],
    cart: CartItem[]
  ): { isValid: boolean; error?: string };

  updateStock(
    productId: string,
    quantityChange: number,
    products: Product[]
  ): Product[];

  restoreStock(
    productId: string,
    quantity: number,
    products: Product[]
  ): Product[];
}

/**
 * 할인 계산 서비스 인터페이스
 */
export interface IDiscountService {
  calculateItemDiscount(productId: string, quantity: number): number;

  calculateBulkDiscount(totalQty: number): number;

  calculateTuesdayDiscount(totalAmount: number): number;
}

/**
 * 알림 서비스 인터페이스
 */
export interface IAlertService {
  showStockAlert(message: string): void;

  startLightningSaleTimer(config: {
    products: Product[];
    onProductUpdate: () => void;
    delay?: number;
  }): void;

  startRecommendationTimer(config: {
    products: Product[];
    onProductUpdate: () => void;
    delay?: number;
  }): void;

  clearAllTimers(): void;
}

/**
 * 상품 관리 서비스 인터페이스
 */
export interface IProductService {
  getProducts(): Product[];

  findProduct(productId: string): Product | undefined;

  updateProductQuantity(productId: string, quantityChange: number): Product[];

  getLowStockProducts(): Array<{
    name: string;
    stock: number;
    message: string;
  }>;
}
