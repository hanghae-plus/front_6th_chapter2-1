import { Product, CartItem } from '../types';
import { calculateIndividualDiscount, calculateBulkDiscount, calculateTuesdayDiscount } from './discountService';
import { calculateTotalPoints } from './pointsService';

interface CartCalculationResult {
  subtotal: number;
  totalAmount: number;
  itemCount: number;
  itemDiscounts: Array<{
    name: string;
    discountRate: number;
    discountAmount: number;
  }>;
}

interface SummaryItem {
  name: string;
  quantity: number;
  total: number;
}

interface DiscountInfoItem {
  type: 'bulk' | 'individual' | 'tuesday';
  name: string;
  rate: string;
}

interface PointsInfo {
  totalPoints: number;
  details: string[];
}

interface StockStatus {
  lowStockItems: Array<{
    name: string;
    quantity: number;
  }>;
  outOfStockItems: string[];
}

// 장바구니 아이템 계산
export function calculateCartItems(cartItems: CartItem[], productList: Product[]): CartCalculationResult {
  let subtotal = 0;
  let totalAmount = 0;
  let itemCount = 0;
  const itemDiscounts: Array<{
    name: string;
    discountRate: number;
    discountAmount: number;
  }> = [];

  for (const cartItem of cartItems) {
    const currentProduct = productList.find((p) => p.id === cartItem.productId);
    if (!currentProduct) continue;

    const quantity = cartItem.quantity;
    const itemTotal = currentProduct.price * quantity;

    itemCount += quantity;
    subtotal += itemTotal;

    // 개별 상품 할인 계산
    const individualDiscount = calculateIndividualDiscount(currentProduct.id, quantity);
    if (individualDiscount > 0) {
      const discountAmount = itemTotal * individualDiscount;
      itemDiscounts.push({
        name: currentProduct.name,
        discountRate: individualDiscount,
        discountAmount: discountAmount,
      });
      totalAmount += itemTotal * (1 - individualDiscount);
    } else {
      totalAmount += itemTotal;
    }
  }

  return { subtotal, totalAmount, itemCount, itemDiscounts };
}

// 최종 금액 계산 (대량구매, 화요일 할인 포함)
export function calculateFinalAmount(subtotal: number, totalAmount: number, itemCount: number): number {
  let finalAmount = totalAmount;

  // 대량구매 할인 적용
  const bulkDiscount = calculateBulkDiscount(itemCount);
  if (bulkDiscount > 0) {
    finalAmount = subtotal * (1 - bulkDiscount);
  }

  // 화요일 할인 적용
  const tuesdayDiscount = calculateTuesdayDiscount();
  if (tuesdayDiscount > 0) {
    finalAmount = finalAmount * (1 - tuesdayDiscount);
  }

  return finalAmount;
}

// 개별 상품 정보 수집
function collectSummaryItems(cartItems: CartItem[], productList: Product[]): SummaryItem[] {
  const summaryItems: SummaryItem[] = [];

  for (const cartItem of cartItems) {
    const currentProduct = productList.find((p) => p.id === cartItem.productId);
    if (!currentProduct) continue;

    const quantity = cartItem.quantity;
    const itemTotal = currentProduct.price * quantity;

    summaryItems.push({
      name: currentProduct.name,
      quantity: quantity,
      total: itemTotal,
    });
  }

  return summaryItems;
}

// 대량구매 할인 정보 생성
function createBulkDiscountInfo(itemCount: number): DiscountInfoItem | null {
  const bulkDiscount = calculateBulkDiscount(itemCount);

  if (bulkDiscount > 0) {
    return {
      type: 'bulk',
      name: '🎉 대량구매 할인 (30개 이상)',
      rate: '-25%',
    };
  }

  return null;
}

// 개별 상품 할인 정보 생성
function createIndividualDiscountInfo(
  itemDiscounts: Array<{
    name: string;
    discountRate: number;
    discountAmount: number;
  }>
): DiscountInfoItem[] {
  return itemDiscounts.map((item) => ({
    type: 'individual',
    name: `${item.name} (10개↑)`,
    rate: `-${(item.discountRate * 100).toFixed(0)}%`,
  }));
}

// 화요일 할인 정보 생성
function createTuesdayDiscountInfo(): DiscountInfoItem | null {
  const tuesdayDiscount = calculateTuesdayDiscount();

  if (tuesdayDiscount > 0) {
    return {
      type: 'tuesday',
      name: '🌟 화요일 추가 할인',
      rate: '-10%',
    };
  }

  return null;
}

// 할인 정보 수집
function collectDiscountInfo(
  itemDiscounts: Array<{
    name: string;
    discountRate: number;
    discountAmount: number;
  }>,
  itemCount: number
): DiscountInfoItem[] {
  const discountInfo: DiscountInfoItem[] = [];

  // 대량구매 할인
  const bulkDiscountInfo = createBulkDiscountInfo(itemCount);
  if (bulkDiscountInfo) {
    discountInfo.push(bulkDiscountInfo);
  }

  // 개별 상품 할인
  const individualDiscountInfo = createIndividualDiscountInfo(itemDiscounts);
  discountInfo.push(...individualDiscountInfo);

  // 화요일 할인
  const tuesdayDiscountInfo = createTuesdayDiscountInfo();
  if (tuesdayDiscountInfo) {
    discountInfo.push(tuesdayDiscountInfo);
  }

  return discountInfo;
}

// 장바구니 요약 정보 생성
export function generateCartSummary(
  cartItems: CartItem[],
  productList: Product[],
  itemDiscounts: Array<{
    name: string;
    discountRate: number;
    discountAmount: number;
  }>,
  itemCount: number
) {
  const summaryItems = collectSummaryItems(cartItems, productList);
  const discountInfo = collectDiscountInfo(itemDiscounts, itemCount);

  return { summaryItems, discountInfo };
}

// 포인트 정보 계산
export function calculatePointsInfo(finalAmount: number, cartItems: CartItem[], productList: Product[]): PointsInfo {
  const pointsData = calculateTotalPoints(finalAmount, cartItems, productList);

  return {
    totalPoints: pointsData.totalPoints,
    details: pointsData.details,
  };
}

// 재고 상태 확인
export function checkStockStatus(productList: Product[]): StockStatus {
  const lowStockItems: Array<{
    name: string;
    quantity: number;
  }> = [];
  const outOfStockItems: string[] = [];

  productList.forEach((product) => {
    if (product.quantity === 0) {
      outOfStockItems.push(product.name);
    } else if (product.quantity < 5) {
      lowStockItems.push({
        name: product.name,
        quantity: product.quantity,
      });
    }
  });

  return { lowStockItems, outOfStockItems };
}
