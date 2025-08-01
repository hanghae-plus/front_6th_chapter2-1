import { PRODUCT_DISCOUNT_RATES_BY_PRODUCT_ID, PRODUCT_IDS } from '../constants/product';
import { Product, CartItem, CartTotals, BonusPoints } from '../types';
import { getProductById } from './product';

export const calculateCartTotals = (cartItems: CartItem[], productList: Product[]): CartTotals => {
  let totalItemCount = 0;
  let subTotalBeforeDiscount = 0;
  let subTotalAfterDiscount = 0;
  const itemDiscounts: Array<{ name: string; discount: number }> = [];

  cartItems.forEach((cartItem) => {
    const product = getProductById(productList, cartItem.productId);
    if (!product) return;

    const quantity = cartItem.quantity;
    totalItemCount += quantity;

    const itemSubtotal = product.price * quantity;
    subTotalBeforeDiscount += itemSubtotal;

    let itemDiscountRate = 0;
    if (
      quantity >= 10 &&
      PRODUCT_DISCOUNT_RATES_BY_PRODUCT_ID[
        product.id as keyof typeof PRODUCT_DISCOUNT_RATES_BY_PRODUCT_ID
      ]
    ) {
      itemDiscountRate =
        PRODUCT_DISCOUNT_RATES_BY_PRODUCT_ID[
          product.id as keyof typeof PRODUCT_DISCOUNT_RATES_BY_PRODUCT_ID
        ];
      itemDiscounts.push({ name: product.name, discount: itemDiscountRate * 100 });
    }

    subTotalAfterDiscount += itemSubtotal * (1 - itemDiscountRate);
  });

  return {
    totalItemCount,
    subTotalBeforeDiscount,
    subTotalAfterDiscount,
    itemDiscounts,
  };
};

export const calculateBonusPoints = ({
  cartItems,
  productList,
  totalItemCount,
  subTotalAfterDiscount,
  isTuesday,
}: {
  cartItems: CartItem[];
  productList: Product[];
  totalItemCount: number;
  subTotalAfterDiscount: number;
  isTuesday: boolean;
}): BonusPoints => {
  const basePoints = Math.floor(subTotalAfterDiscount / 1000);
  let finalPoints = 0;
  const pointsDetail: string[] = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  if (isTuesday && basePoints > 0) {
    finalPoints *= 2;
    pointsDetail.push('화요일 2배');
  }

  const productIdsInCart = new Set(
    cartItems.map((item) => productList.find((p) => p.id === item.productId)?.id).filter(Boolean),
  );

  const hasKeyboard = productIdsInCart.has(PRODUCT_IDS.KEYBOARD);
  const hasMouse = productIdsInCart.has(PRODUCT_IDS.MOUSE);
  const hasMonitorArm = productIdsInCart.has(PRODUCT_IDS.MONITOR_ARM);

  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push('키보드+마우스 세트 +50p');

    if (hasMonitorArm) {
      finalPoints += 100;
      pointsDetail.push('풀세트 구매 +100p');
    }
  }

  const bulkBonusTable = [
    { min: 30, bonus: 100, label: '대량구매(30개+) +100p' },
    { min: 20, bonus: 50, label: '대량구매(20개+) +50p' },
    { min: 10, bonus: 20, label: '대량구매(10개+) +20p' },
  ];

  for (const tier of bulkBonusTable) {
    if (totalItemCount >= tier.min) {
      finalPoints += tier.bonus;
      pointsDetail.push(tier.label);
      break;
    }
  }

  return { finalPoints, pointsDetail };
};
