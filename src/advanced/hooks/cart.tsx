import { isCartTotalBulk } from '../../basic/model/cart';
import {
  SPECIAL_DAY_DISCOUNT_RATE,
  TOTAL_BULK_DISCOUNT_RATE,
} from '../constants/discount';
import {
  FULL_SET_BONUS_POINTS,
  KEYBOARD_AND_MOUSE_BONUS_POINTS,
  TOTAL_BULK_10_BONUS_POINTS,
  TOTAL_BULK_20_BONUS_POINTS,
  TOTAL_BULK_30_BONUS_POINTS,
} from '../constants/point';
import {
  BONUS_POINTS_TOTAL_BULK_10_THRESHOLD,
  BONUS_POINTS_TOTAL_BULK_20_THRESHOLD,
  BONUS_POINTS_TOTAL_BULK_30_THRESHOLD,
} from '../constants/quantity';
import { useCart } from '../stores/cart';
import { useProducts } from '../stores/products';
import { isSpecialDay } from '../utils/day';
import { applyDiscount } from '../utils/discount';
import { findById } from '../utils/find';
import { formatPoint } from '../utils/point';
import { getTotalCount, isItemBulk } from '../utils/quantity';

export function useCartTotalCount() {
  const carts = useCart((state) => state.carts);
  return getTotalCount(carts);
}

interface UseAddToCartParams {
  productId: string;
}

export function useAddToCart({ productId }: UseAddToCartParams) {
  const addCartItemQuantity = useAddCartItemQuantity({ productId });

  const addToCart = () => {
    addCartItemQuantity({ incrementQuantity: 1 });
  };

  return addToCart;
}

interface UseAddCartItemQuantityParams {
  productId: string;
}

export function useAddCartItemQuantity({
  productId,
}: UseAddCartItemQuantityParams) {
  const products = useProducts((state) => state.products);
  const addQuantity = useCart((state) => state.addQuantity);

  const addCartItemQuantity = ({
    incrementQuantity,
  }: {
    incrementQuantity: number;
  }) => {
    const product = findById({ data: products, id: productId });

    if (product.quantity >= incrementQuantity) {
      addQuantity({ id: productId, quantity: incrementQuantity });
    } else {
      // TODO: 재고 부족 처리
      alert('재고가 부족합니다.');
    }
  };

  return addCartItemQuantity;
}

export function useCartTotalPrice() {
  const carts = useCart((state) => state.carts);
  const products = useProducts((state) => state.products);

  return carts.reduce((acc, { id, quantity }) => {
    const { price } = findById({ data: products, id });
    return acc + quantity * price;
  }, 0);
}

export function useCartBulkItemSaledTotalPrice() {
  const carts = useCart((state) => state.carts);
  const products = useProducts((state) => state.products);

  return carts.reduce((acc, { id, quantity }) => {
    const { price, bulkSaleRate } = findById({ data: products, id });
    const discountRate = isItemBulk(quantity) ? bulkSaleRate : 0;
    const saledPrice = applyDiscount({ price, rate: discountRate });
    return acc + quantity * saledPrice;
  }, 0);
}

export function useCartPaidPrice() {
  const cartTotalCount = useCartTotalCount();
  const totalPrice = useCartTotalPrice();
  const bulkItemSaledTotalPrice = useCartBulkItemSaledTotalPrice();

  const cartBulkSaledPrice = applyCartBulkDiscount({
    price: totalPrice,
    count: cartTotalCount,
  });
  return applySpecialDayDiscount(
    Math.min(cartBulkSaledPrice, bulkItemSaledTotalPrice)
  );

  function applyCartBulkDiscount({
    price,
    count,
  }: {
    price: number;
    count: number;
  }) {
    return isCartTotalBulk(count)
      ? applyDiscount({ price, rate: TOTAL_BULK_DISCOUNT_RATE })
      : price;
  }

  function applySpecialDayDiscount(price: number) {
    return isSpecialDay()
      ? applyDiscount({ price, rate: SPECIAL_DAY_DISCOUNT_RATE })
      : price;
  }
}

export function useCartPointInfo() {
  const paidPrice = useCartPaidPrice();
  const bonusItemPoint = useBonusItemPoint();
  const bulkPoint = useCartBulkPoint();

  const basePoint = Math.floor(paidPrice / 1_000);

  return {
    point:
      applySpecialDayPoint(basePoint) + bonusItemPoint.point + bulkPoint.point,
    bonusItemDetail: bonusItemPoint.details,
    bulkDetail: bulkPoint.details,
  };

  function applySpecialDayPoint(point: number) {
    return isSpecialDay() ? point * 2 : point;
  }

  function useBonusItemPoint() {
    const PRODUCT_ID = {
      KEYBOARD: 'p1',
      MOUSE: 'p2',
      MONITOR_ARM: 'p3',
    };

    const BONUS_RULES = [
      {
        name: 'KEYBOARD_AND_MOUSE',
        requiredProducts: [PRODUCT_ID.KEYBOARD, PRODUCT_ID.MOUSE],
        points: KEYBOARD_AND_MOUSE_BONUS_POINTS,
        label: '키보드+마우스 세트',
      },
      {
        name: 'FULL_SET',
        requiredProducts: [
          PRODUCT_ID.KEYBOARD,
          PRODUCT_ID.MOUSE,
          PRODUCT_ID.MONITOR_ARM,
        ],
        points: FULL_SET_BONUS_POINTS,
        label: '풀세트 구매',
      },
    ];

    const carts = useCart((state) => state.carts);

    // 장바구니에 있는 상품 ID들을 추출
    const cartProductIds = new Set(carts.map((cart) => cart.id));

    // 각 보너스 규칙이 충족되는지 확인
    const applicableBonuses = BONUS_RULES.filter((rule) =>
      rule.requiredProducts.every((productId) => cartProductIds.has(productId))
    );

    // 총 보너스 포인트 계산
    const totalPoints = applicableBonuses.reduce(
      (sum, bonus) => sum + bonus.points,
      0
    );

    // 보너스 상세 정보 생성
    const bonusDetails = applicableBonuses.map(
      (bonus) =>
        `${bonus.label} ${formatPoint({ point: bonus.points, signDisplay: 'always' })}`
    );

    return {
      point: totalPoints,
      details: bonusDetails,
    };
  }

  function useCartBulkPoint() {
    const BULK_PURCHASE_TIERS = [
      {
        threshold: BONUS_POINTS_TOTAL_BULK_30_THRESHOLD,
        points: TOTAL_BULK_30_BONUS_POINTS,
      },
      {
        threshold: BONUS_POINTS_TOTAL_BULK_20_THRESHOLD,
        points: TOTAL_BULK_20_BONUS_POINTS,
      },
      {
        threshold: BONUS_POINTS_TOTAL_BULK_10_THRESHOLD,
        points: TOTAL_BULK_10_BONUS_POINTS,
      },
    ];

    const cartTotalCount = useCartTotalCount();

    // 적용 가능한 최고 티어 찾기 (내림차순 정렬되어 있다고 가정)
    const applicableTier = BULK_PURCHASE_TIERS.find(
      (tier) => cartTotalCount >= tier.threshold
    );

    // 적용 가능한 티어가 없으면 기본값 반환
    if (!applicableTier) {
      return {
        point: 0,
        details: [],
      };
    }

    return {
      point: applicableTier.points,
      details: [
        `대량구매(${applicableTier.threshold}개+) ${formatPoint({
          point: applicableTier.points,
          signDisplay: 'always',
        })}`,
      ],
    };
  }
}
