import { POINT_POLICY_MAP } from '@/advanced/data/point.data';
import { PRODUCT_1, PRODUCT_2, PRODUCT_3 } from '@/advanced/data/product.data';
import {
  MIN_QUANTITY_FOR_POINT_BONUS_TIER1,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER2,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER3,
} from '@/advanced/data/quantity.data';
import useDiscount from '@/advanced/hooks/useDiscount';
import useOrderSummary from '@/advanced/hooks/useOrderSummary';
import { useCartStore } from '@/advanced/store';
import { PointPolicy } from '@/advanced/types/point.type';
import { getCartTotalCount } from '@/advanced/utils/cart.util';

export default function usePoint() {
  const { totalPrice } = useOrderSummary();
  const { cartItems } = useCartStore();
  const { isTuesday } = useDiscount();

  const defaultPoint = POINT_POLICY_MAP[PointPolicy.DEFAULT](0, totalPrice);

  const getPointPolicies = () => {
    const policies: PointPolicy[] = [];

    // 화요일 정책 (현재 시간이 화요일인지 확인)
    if (isTuesday) {
      policies.push(PointPolicy.TUESDAY);
    }

    // 키보드 세트 정책 (p1이 포함되어 있는지 확인)
    const hasKeyboard =
      cartItems.some(item => item.id === PRODUCT_1) &&
      cartItems.some(item => item.id === PRODUCT_2);
    // 풀 세트
    const hasFullSet =
      cartItems.some(item => item.id === PRODUCT_1) &&
      cartItems.some(item => item.id === PRODUCT_2) &&
      cartItems.some(item => item.id === PRODUCT_3);

    if (hasFullSet) {
      policies.push(PointPolicy.FULL_SET);
    } else if (hasKeyboard) {
      policies.push(PointPolicy.KEYBOARD_SET);
    }

    // 대량 구매 보너스 정책
    const totalCount = getCartTotalCount(cartItems);

    if (totalCount >= MIN_QUANTITY_FOR_POINT_BONUS_TIER3) {
      policies.push(PointPolicy.BULK_BONUS_30);
    } else if (totalCount >= MIN_QUANTITY_FOR_POINT_BONUS_TIER2) {
      policies.push(PointPolicy.BULK_BONUS_20);
    } else if (totalCount >= MIN_QUANTITY_FOR_POINT_BONUS_TIER1) {
      policies.push(PointPolicy.BULK_BONUS_10);
    }

    return policies;
  };

  const applicablePolicies = getPointPolicies();

  const calculateTotalPoint = () => {
    let currentPoint = defaultPoint;

    // 각 정책을 순차적으로 적용
    applicablePolicies.forEach(policy => {
      currentPoint = POINT_POLICY_MAP[policy](currentPoint, totalPrice);
    });

    return currentPoint;
  };

  const totalPoint = calculateTotalPoint();

  return {
    totalPoint,
    applicablePolicies,
    defaultPoint,
  };
}
