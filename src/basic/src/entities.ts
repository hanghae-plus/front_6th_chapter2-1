/**
 * 상품, 장바구니, 할인, 포인트 관련 비즈니스 로직
 * 모든 함수는 순수 함수로 구현되어 테스트 가능
 */
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

/**
 * 비즈니스 요구사항에 따른 상수 정의
 */
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

/**
 * 초기 상품 데이터 생성
 * 요구사항: 5개 상품, 각 상품별 초기 재고 수량 지정
 */
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

/**
 * 전체 재고 수량 계산
 * 요구사항: 50개 미만일 때 테두리 주황색 표시
 */
export const calculateTotalStock = (products: Product[]): number => products.reduce((total: number, product: Product) => total + product.quantity, 0)

/**
 * 재고 정보 조회
 * 요구사항: 5개 미만 재고 부족 경고, 0개 품절 표시
 */
export const getStockInfo = (products: Product[]): StockInfo => {
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

/**
 * 개별 상품 할인율 계산
 * 요구사항: 10개 이상 구매 시 상품별 할인율 적용
 */
export const calculateItemDiscount = (productId: string, quantity: number): number => {
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

/**
 * 화요일 여부 확인
 * 요구사항: 화요일에는 추가 10% 할인 및 포인트 2배 적립
 */
export const isTuesday = (date: Date): boolean => date.getDay() === 2

/**
 * 화요일 할인 적용
 * 요구사항: 화요일에 한해 전체 금액에서 추가 10% 할인
 */
export const applyTuesdayDiscount = (amount: number, isToday: boolean): number => {
  if (isToday && amount > 0) {
    return amount * (1 - DISCOUNT_RATES.TUESDAY);
  }
  return amount;
}

/**
 * 총 할인율 계산
 */
export const calculateDiscountRate = (originalTotal: number, finalTotal: number): number => {
  if (originalTotal === 0) return 0;
  return 1 - (finalTotal / originalTotal);
}

/**
 * 대량 구매 할인 적용
 * 요구사항: 30개 이상 구매 시 전체 25% 할인 (개별 할인과 중복 불가)
 */
export const applyBulkDiscount = (subtotal: number, itemCount: number): BulkDiscountResult => {
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

/**
 * 장바구니 데이터 계산
 * 할인 정책: 개별 할인 -> 대량 구매 할인 -> 화요일 할인 순서로 적용
 */
export const calculateCartData = (cart: Cart, products: Product[], currentDate: Date = new Date()): CartData => {
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
  
  const cartItems = Object.keys(cart);
  if (cartItems.length === 0) {
    return result;
  }
  
  cartItems.forEach(function(productId: string) {
    const quantity = cart[productId];
    const product = products.find(function(p: Product) {
      return p.id === productId;
    });
    
    if (!product || quantity <= 0) return;
    
    const itemTotal = product.val * quantity;
    
    result.itemCount += quantity;
    result.subtotal += itemTotal;
    
    const itemDiscount = calculateItemDiscount(product.id, quantity);
    
    if (itemDiscount > 0) {
      result.itemDiscounts.push({ name: product.name, discount: itemDiscount * 100 });
    }
    
    result.totalAmount += itemTotal * (1 - itemDiscount);
    
    result.summaryItems.push({
      name: product.name,
      quantity: quantity,
      total: itemTotal
    });
  });
  
  const originalTotal = result.subtotal;
  
  const bulkDiscountResult = applyBulkDiscount(result.subtotal, result.itemCount);
  if (result.itemCount >= DISCOUNT_THRESHOLDS.BULK_DISCOUNT) {
    result.totalAmount = bulkDiscountResult.amount;
    result.discountRate = bulkDiscountResult.discountRate;
  } else {
    result.discountRate = calculateDiscountRate(result.subtotal, result.totalAmount);
  }
  
  result.isTuesday = isTuesday(currentDate);
  result.totalAmount = applyTuesdayDiscount(result.totalAmount, result.isTuesday);
  result.discountRate = calculateDiscountRate(originalTotal, result.totalAmount);
  
  if (result.discountRate > 0 && result.totalAmount > 0) {
    result.savedAmount = originalTotal - result.totalAmount;
  }
  
  return result;
}

/**
 * 포인트 적립 계산
 * 요구사항: 기본 0.1%, 화요일 2배, 세트 보너스, 수량별 보너스
 */
export const calculatePoints = (cartData: CartData, cart: Cart, currentDate: Date = new Date()): PointsData => {
  const result: PointsData = {
    basePoints: 0,
    finalPoints: 0,
    details: []
  };
  
  if (cartData.itemCount === 0) {
    return result;
  }
  
  result.basePoints = Math.floor(cartData.totalAmount / 1000);
  result.finalPoints = result.basePoints;
  
  if (result.basePoints > 0) {
    result.details.push(`기본: ${result.basePoints}p`);
  }
  
  if (isTuesday(currentDate) && result.basePoints > 0) {
    result.finalPoints = result.basePoints * 2;
    result.details.push('화요일 2배');
  }
  
  const hasKeyboard = cart[PRODUCT_IDS.KEYBOARD] > 0;
  const hasMouse = cart[PRODUCT_IDS.MOUSE] > 0;
  const hasMonitorArm = cart[PRODUCT_IDS.MONITOR_ARM] > 0;
  
  if (hasKeyboard && hasMouse) {
    result.finalPoints += POINTS_BONUSES.KEYBOARD_MOUSE_SET;
    result.details.push(`키보드+마우스 세트 +${POINTS_BONUSES.KEYBOARD_MOUSE_SET}p`);
  }
  
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    result.finalPoints += POINTS_BONUSES.FULL_SET;
    result.details.push(`풀세트 구매 +${POINTS_BONUSES.FULL_SET}p`);
  }
  
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

/**
 * 번개세일 적용: 20% 할인
 * 재고가 있고 이미 세일 중이 아닌 상품만 대상
 */
export const applyLightningSale = (products: Product[], productId: string): Product[] => products.map(function (product: Product) {
  if (product.id === productId && product.quantity > 0 && !product.onSale) {
    return {
      ...product,
      val: Math.round(product.originalVal * (1 - DISCOUNT_RATES.LIGHTNING)),
      onSale: true
    };
  }
  return product;
})

/**
 * 추천 할인 적용: 5% 할인
 * 요구사항: 마지막 선택 상품과 다른 상품 추천, 재고 있는 상품만 대상
 */
export const applySuggestionSale = (products: Product[], productId: string, excludeId: string): Product[] => products.map(function (product: Product) {
  if (product.id === productId && product.id !== excludeId && product.quantity > 0 && !product.suggestSale) {
    return {
      ...product,
      val: Math.round(product.val * (1 - DISCOUNT_RATES.SUGGESTION)),
      suggestSale: true
    };
  }
  return product;
})

/**
 * 재고 수량 업데이트
 * quantityChange: 양수면 재고 증가, 음수면 재고 감소
 */
export const updateProductStock = (products: Product[], productId: string, quantityChange: number): Product[] => products.map(function (product: Product) {
  if (product.id === productId) {
    return {
      ...product,
      quantity: product.quantity + quantityChange
    };
  }
  return product;
})

/**
 * 장바구니 상품 추가
 * 기존 수량에 누적
 */
export const addToCart = (cart: Cart, productId: string, quantity: number = 1): Cart => ({
  ...cart,
  [productId]: (cart[productId] || 0) + quantity
})

/**
 * 장바구니 수량 변경
 * 요구사항: 0개 이하 시 자동 삭제
 */
export const updateCartQuantity = (cart: Cart, productId: string, newQuantity: number): Cart => {
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

/**
 * 장바구니에서 상품 제거
 */
export const removeFromCart = (cart: Cart, productId: string): Cart => {
  const newCart = { ...cart };
  delete newCart[productId];
  return newCart;
}

/**
 * 장바구니 추가 가능 여부 검증
 * 요구사항: 재고 수량을 초과하여 담을 수 없음
 */
export const canAddToCart = (product: Product, currentCartQuantity: number, requestedQuantity: number): boolean => {
  const totalRequestedQuantity = currentCartQuantity + requestedQuantity;
  return product.quantity >= requestedQuantity && totalRequestedQuantity <= product.quantity + currentCartQuantity;
}

/**
 * 구매 가능한 재고 수량 계산
 * 요구사항: 현재 장바구니 수량 포함하여 계산
 */
export const getAvailableStock = (product: Product, currentCartQuantity: number): number => product.quantity + currentCartQuantity