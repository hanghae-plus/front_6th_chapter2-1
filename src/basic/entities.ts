// entities.ts - 비즈니스 로직과 순수 함수들

// Types
export interface Product {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface Cart {
  [productId: string]: number;
}

export interface CartData {
  totalAmount: number;
  itemCount: number;
  subtotal: number;
  itemDiscounts: Array<{ name: string; discount: number }>;
  discountRate: number;
  savedAmount: number;
  isTuesday: boolean;
  summaryItems: Array<{ name: string; quantity: number; total: number }>;
}

export interface PointsData {
  basePoints: number;
  finalPoints: number;
  details: string[];
}

export interface StockInfo {
  totalStock: number;
  lowStockItems: Array<{ product: Product; message: string }>;
}

export interface BulkDiscountResult {
  amount: number;
  discountRate: number;
}

// Constants
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5'
};

export const DISCOUNT_RATES = {
  KEYBOARD: 0.10,
  MOUSE: 0.15,
  MONITOR_ARM: 0.20,
  LAPTOP_POUCH: 0.05,
  SPEAKER: 0.25,
  BULK: 0.25,
  TUESDAY: 0.10,
  LIGHTNING: 0.20,
  SUGGESTION: 0.05
};

export const DISCOUNT_THRESHOLDS = {
  ITEM_DISCOUNT: 10,
  BULK_DISCOUNT: 30,
  LOW_STOCK: 5,
  LOW_TOTAL_STOCK: 50
};

export const POINTS_BONUSES = {
  KEYBOARD_MOUSE_SET: 50,
  FULL_SET: 100,
  BULK_10: 20,
  BULK_20: 50,
  BULK_30: 100
};

// Pure Functions

// Product Management
export function createInitialProducts(): Product[] {
  return [
    {
      id: PRODUCT_IDS.KEYBOARD,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      quantity: 50,
      onSale: false,
      suggestSale: false
    },
    {
      id: PRODUCT_IDS.MOUSE,
      name: '생산성 폭발 마우스',
      val: 20000,
      originalVal: 20000,
      quantity: 30,
      onSale: false,
      suggestSale: false
    },
    {
      id: PRODUCT_IDS.MONITOR_ARM,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      quantity: 20,
      onSale: false,
      suggestSale: false
    },
    {
      id: PRODUCT_IDS.LAPTOP_POUCH,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      quantity: 0,
      onSale: false,
      suggestSale: false
    },
    {
      id: PRODUCT_IDS.SPEAKER,
      name: '코딩할 때 듣는 Lo-Fi 스피커',
      val: 25000,
      originalVal: 25000,
      quantity: 10,
      onSale: false,
      suggestSale: false
    }
  ];
}

export function calculateTotalStock(products: Product[]): number {
  return products.reduce((total: number, product: Product) => total + product.quantity, 0);
}

export function getStockInfo(products: Product[]): StockInfo {
  const totalStock = calculateTotalStock(products);
  const lowStockItems = products
    .filter((item: Product) => item.quantity < DISCOUNT_THRESHOLDS.LOW_STOCK)
    .map((item: Product) => ({
      product: item,
      message: item.quantity > 0
        ? `${item.name}: 재고 부족 (${item.quantity}개 남음)`
        : `${item.name}: 품절`
    }));
  
  return { totalStock, lowStockItems };
}

// Discount Calculations
export function calculateItemDiscount(productId: string, quantity: number): number {
  if (quantity < DISCOUNT_THRESHOLDS.ITEM_DISCOUNT) return 0;
  
  switch(productId) {
    case PRODUCT_IDS.KEYBOARD: return DISCOUNT_RATES.KEYBOARD;
    case PRODUCT_IDS.MOUSE: return DISCOUNT_RATES.MOUSE;
    case PRODUCT_IDS.MONITOR_ARM: return DISCOUNT_RATES.MONITOR_ARM;
    case PRODUCT_IDS.LAPTOP_POUCH: return DISCOUNT_RATES.LAPTOP_POUCH;
    case PRODUCT_IDS.SPEAKER: return DISCOUNT_RATES.SPEAKER;
    default: return 0;
  }
}

export function isTuesday(date: Date): boolean {
  return date.getDay() === 2;
}

export function applyTuesdayDiscount(amount: number, isToday: boolean): number {
  if (isToday && amount > 0) {
    return amount * (1 - DISCOUNT_RATES.TUESDAY);
  }
  return amount;
}

export function calculateDiscountRate(originalTotal: number, finalTotal: number): number {
  if (originalTotal === 0) return 0;
  return 1 - (finalTotal / originalTotal);
}

export function applyBulkDiscount(subtotal: number, itemCount: number): BulkDiscountResult {
  if (itemCount >= DISCOUNT_THRESHOLDS.BULK_DISCOUNT) {
    return {
      amount: subtotal * (1 - DISCOUNT_RATES.BULK),
      discountRate: DISCOUNT_RATES.BULK
    };
  }

  return {
    amount: subtotal,
    discountRate: 0
  };
}

// Cart Calculations
export function calculateCartData(cart: Cart, products: Product[], currentDate: Date = new Date()): CartData {
  const result: CartData = {
    totalAmount: 0,
    itemCount: 0,
    subtotal: 0,
    itemDiscounts: [],
    discountRate: 0,
    savedAmount: 0,
    isTuesday: false,
    summaryItems: []
  };
  
  // 빈 장바구니 체크
  const cartItems = Object.keys(cart);
  if (cartItems.length === 0) {
    return result;
  }
  
  // 아이템별 계산
  cartItems.forEach(function(productId: string) {
    const quantity = cart[productId];
    const product = products.find(function(p: Product) {
      return p.id === productId;
    });
    
    if (!product || quantity <= 0) return;
    
    // 현재가 기준으로 계산 (번개세일, 추천할인이 적용된 가격)
    const itemTotal = product.val * quantity;
    
    result.itemCount += quantity;
    result.subtotal += itemTotal;
    
    // 개별 상품 할인 (10개 이상일 때)
    const itemDiscount = calculateItemDiscount(product.id, quantity);
    
    if (itemDiscount > 0) {
      result.itemDiscounts.push({ name: product.name, discount: itemDiscount * 100 });
    }
    
    // 할인 적용
    result.totalAmount += itemTotal * (1 - itemDiscount);
    
    result.summaryItems.push({
      name: product.name,
      quantity: quantity,
      total: itemTotal
    });
  });
  
  const originalTotal = result.subtotal;
  
  // 대량 구매 할인
  const bulkDiscountResult = applyBulkDiscount(result.subtotal, result.itemCount);
  if (result.itemCount >= DISCOUNT_THRESHOLDS.BULK_DISCOUNT) {
    result.totalAmount = bulkDiscountResult.amount;
    result.discountRate = bulkDiscountResult.discountRate;
  } else {
    result.discountRate = calculateDiscountRate(result.subtotal, result.totalAmount);
  }
  
  // 화요일 할인
  result.isTuesday = isTuesday(currentDate);
  result.totalAmount = applyTuesdayDiscount(result.totalAmount, result.isTuesday);
  result.discountRate = calculateDiscountRate(originalTotal, result.totalAmount);
  
  // 할인 금액 계산
  if (result.discountRate > 0 && result.totalAmount > 0) {
    result.savedAmount = originalTotal - result.totalAmount;
  }
  
  return result;
}

// Points Calculations
export function calculatePoints(cartData: CartData, cart: Cart, currentDate: Date = new Date()): PointsData {
  const result: PointsData = {
    basePoints: 0,
    finalPoints: 0,
    details: []
  };
  
  if (cartData.itemCount === 0) {
    return result;
  }
  
  // 기본 포인트
  result.basePoints = Math.floor(cartData.totalAmount / 1000);
  result.finalPoints = result.basePoints;
  
  if (result.basePoints > 0) {
    result.details.push(`기본: ${result.basePoints}p`);
  }
  
  // 화요일 보너스
  if (isTuesday(currentDate) && result.basePoints > 0) {
    result.finalPoints = result.basePoints * 2;
    result.details.push('화요일 2배');
  }
  
  // 세트 구매 확인
  const hasKeyboard = cart[PRODUCT_IDS.KEYBOARD] > 0;
  const hasMouse = cart[PRODUCT_IDS.MOUSE] > 0;
  const hasMonitorArm = cart[PRODUCT_IDS.MONITOR_ARM] > 0;
  
  // 세트 보너스
  if (hasKeyboard && hasMouse) {
    result.finalPoints += POINTS_BONUSES.KEYBOARD_MOUSE_SET;
    result.details.push(`키보드+마우스 세트 +${POINTS_BONUSES.KEYBOARD_MOUSE_SET}p`);
  }
  
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    result.finalPoints += POINTS_BONUSES.FULL_SET;
    result.details.push(`풀세트 구매 +${POINTS_BONUSES.FULL_SET}p`);
  }
  
  // 수량별 보너스
  if (cartData.itemCount >= 30) {
    result.finalPoints += POINTS_BONUSES.BULK_30;
    result.details.push(`대량구매(30개+) +${POINTS_BONUSES.BULK_30}p`);
  } else if (cartData.itemCount >= 20) {
    result.finalPoints += POINTS_BONUSES.BULK_20;
    result.details.push(`대량구매(20개+) +${POINTS_BONUSES.BULK_20}p`);
  } else if (cartData.itemCount >= 10) {
    result.finalPoints += POINTS_BONUSES.BULK_10;
    result.details.push(`대량구매(10개+) +${POINTS_BONUSES.BULK_10}p`);
  }
  
  return result;
}

// Sale Management (setState를 통해 상태 업데이트)
export function applyLightningSale(products: Product[], productId: string): Product[] {
  return products.map(function(product: Product) {
    if (product.id === productId && product.quantity > 0 && !product.onSale) {
      return {
        ...product,
        val: Math.round(product.originalVal * (1 - DISCOUNT_RATES.LIGHTNING)),
        onSale: true
      };
    }
    return product;
  });
}

export function applySuggestionSale(products: Product[], productId: string, excludeId: string): Product[] {
  return products.map(function(product: Product) {
    if (product.id === productId && product.id !== excludeId && product.quantity > 0 && !product.suggestSale) {
      return {
        ...product,
        val: Math.round(product.val * (1 - DISCOUNT_RATES.SUGGESTION)),
        suggestSale: true
      };
    }
    return product;
  });
}

// Stock Management
export function updateProductStock(products: Product[], productId: string, quantityChange: number): Product[] {
  return products.map(function(product: Product) {
    if (product.id === productId) {
      return {
        ...product,
        quantity: product.quantity + quantityChange
      };
    }
    return product;
  });
}

// Cart Operations
export function addToCart(cart: Cart, productId: string, quantity: number = 1): Cart {
  return {
    ...cart,
    [productId]: (cart[productId] || 0) + quantity
  };
}

export function updateCartQuantity(cart: Cart, productId: string, newQuantity: number): Cart {
  if (newQuantity <= 0) {
    const newCart = { ...cart };
    delete newCart[productId];
    return newCart;
  }
  return {
    ...cart,
    [productId]: newQuantity
  };
}

export function removeFromCart(cart: Cart, productId: string): Cart {
  const newCart = { ...cart };
  delete newCart[productId];
  return newCart;
}

// Validation
export function canAddToCart(product: Product, currentCartQuantity: number, requestedQuantity: number): boolean {
  const totalRequestedQuantity = currentCartQuantity + requestedQuantity;
  return product.quantity >= requestedQuantity && totalRequestedQuantity <= product.quantity + currentCartQuantity;
}

export function getAvailableStock(product: Product, currentCartQuantity: number): number {
  return product.quantity + currentCartQuantity;
}