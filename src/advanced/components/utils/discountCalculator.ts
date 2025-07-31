import { PRODUCT_IDS } from '../../lib/products';
import { CartItem, DiscountResult, Product } from '../../types';

// 기존 interface 제거하고 import 사용
export type { DiscountResult };

// 원가 총액 계산
const calculateOriginalTotal = (cartItems: CartItem[], products: Product[]): number => {
  return cartItems.reduce((total, item) => {
    const product = products.find((p) => p.productId === item.productId);
    return total + (product ? product.originalPrice * item.quantity : 0);
  }, 0);
};

// 할인된 가격 총액 계산
const calculateDiscountedPriceTotal = (cartItems: CartItem[], products: Product[]): number => {
  return cartItems.reduce((total, item) => {
    const product = products.find((p) => p.productId === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
};

// 번개세일/추천할인 할인 내역 계산
const calculateSaleDiscounts = (cartItems: CartItem[], products: Product[]) => {
  const discountDetails: Array<{ name: string; discountRate: number }> = [];

  cartItems.forEach((item) => {
    const product = products.find((p) => p.productId === item.productId);
    if (product && (product.isOnSale || product.isRecommended)) {
      const discountRate = ((product.originalPrice - product.price) / product.originalPrice) * 100;

      if (product.isOnSale && product.isRecommended) {
        discountDetails.push({
          name: `⚡💝 ${product.name} 슈퍼세일`,
          discountRate: Math.round(discountRate),
        });
      } else if (product.isOnSale) {
        discountDetails.push({
          name: `⚡ ${product.name} 번개세일`,
          discountRate: Math.round(discountRate),
        });
      } else if (product.isRecommended) {
        discountDetails.push({
          name: `💝 ${product.name} 추천할인`,
          discountRate: Math.round(discountRate),
        });
      }
    }
  });

  return discountDetails;
};

// 개별 상품 할인율 가져오기
const getItemDiscountRate = (productId: string): number => {
  switch (productId) {
    case PRODUCT_IDS.KEYBOARD:
      return 0.1;
    case PRODUCT_IDS.MOUSE:
      return 0.15;
    case PRODUCT_IDS.MONITOR_ARM:
      return 0.2;
    case PRODUCT_IDS.POUCH:
      return 0.05;
    case PRODUCT_IDS.SPEAKER:
      return 0.25;
    default:
      return 0;
  }
};

// 개별 상품 할인 (10개 이상) 계산
const calculateItemDiscounts = (cartItems: CartItem[], products: Product[]) => {
  const discountDetails: Array<{ name: string; discountRate: number }> = [];
  let totalDiscount = 0;
  let hasItemDiscount = false;

  cartItems.forEach((item) => {
    if (item.quantity >= 10) {
      const product = products.find((p) => p.productId === item.productId);
      if (product) {
        const discountRate = getItemDiscountRate(product.productId);
        if (discountRate > 0) {
          const itemTotal = product.price * item.quantity;
          totalDiscount += itemTotal * discountRate;
          discountDetails.push({
            name: `${product.name} (10개↑)`,
            discountRate: discountRate * 100,
          });
          hasItemDiscount = true;
        }
      }
    }
  });

  return { discountDetails, totalDiscount, hasItemDiscount };
};

// 대량 구매 할인 계산
const calculateBulkDiscount = (totalQuantity: number, discountedPriceTotal: number, hasItemDiscount: boolean) => {
  if (totalQuantity >= 30 && !hasItemDiscount) {
    return {
      discountAmount: discountedPriceTotal * 0.25,
      discountDetails: [
        {
          name: '🎉 대량구매 할인 (30개 이상)',
          discountRate: 25,
        },
      ],
    };
  }
  return { discountAmount: 0, discountDetails: [] };
};

// 화요일 할인 계산
const calculateTuesdayDiscount = (currentTotal: number) => {
  const today = new Date();
  const isTuesday = today.getDay() === 2;

  if (isTuesday && currentTotal > 0) {
    return {
      discountAmount: currentTotal * 0.1,
      discountDetails: [
        {
          name: '🌟 화요일 추가 할인',
          discountRate: 10,
        },
      ],
    };
  }
  return { discountAmount: 0, discountDetails: [] };
};

export function calculateDiscount(cartItems: CartItem[], products: Product[]): DiscountResult {
  const originalTotal = calculateOriginalTotal(cartItems, products);
  const discountedPriceTotal = calculateDiscountedPriceTotal(cartItems, products);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 번개세일/추천할인 할인 내역
  const saleDiscountDetails = calculateSaleDiscounts(cartItems, products);

  // 개별 상품 할인
  const {
    discountDetails: itemDiscountDetails,
    totalDiscount: itemDiscount,
    hasItemDiscount,
  } = calculateItemDiscounts(cartItems, products);

  // 대량 구매 할인
  const { discountAmount: bulkDiscount, discountDetails: bulkDiscountDetails } = calculateBulkDiscount(
    totalQuantity,
    discountedPriceTotal,
    hasItemDiscount
  );

  // 화요일 할인
  const { discountAmount: tuesdayDiscount, discountDetails: tuesdayDiscountDetails } = calculateTuesdayDiscount(
    discountedPriceTotal - itemDiscount - bulkDiscount
  );

  // 최종 계산
  const finalTotal = discountedPriceTotal - itemDiscount - bulkDiscount - tuesdayDiscount;

  // 모든 할인 내역 합치기
  const allDiscountDetails = [
    ...saleDiscountDetails,
    ...itemDiscountDetails,
    ...bulkDiscountDetails,
    ...tuesdayDiscountDetails,
  ];

  const savedAmount = originalTotal - finalTotal;
  const discountRate = originalTotal > 0 ? savedAmount / originalTotal : 0;

  return {
    originalTotal,
    discountedTotal: finalTotal,
    discountRate,
    savedAmount,
    discountDetails: allDiscountDetails,
  };
}
