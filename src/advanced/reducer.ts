import { DISCOUNT_RATES, INITIAL_PRODUCTS, POINTS, PRODUCT_IDS } from './constant';

// --- 기본 데이터 구조 타입 정의 ---

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Notification {
  id: number;
  message: string;
}

export interface CartItemForDisplay {
  name: string;
  quantity: number;
  totalPrice: number;
}

// --- 전체 상태(State) 타입 정의 ---

export interface State {
  products: Product[];
  cartList: CartItem[];
  notifications: Notification[];
  selectedProductId: string;
  lastSelectedId: string | null;
}

// --- 모든 액션(Action) 타입 정의 (Discriminated Union) ---

type ActionMap = {
  ADD_ITEM: { productId: string };
  REMOVE_ITEM: { productId: string };
  INCREASE_QUANTITY: { productId: string };
  DECREASE_QUANTITY: { productId: string };
  START_LIGHTNING_SALE: { productId: string };
  START_SUGGEST_SALE: { productId: string };
  SET_SELECTED_PRODUCT: { productId: string };
  SET_LAST_SELECTED: { productId: string };
  REMOVE_NOTIFICATION: { notificationId: number };
};

// 모든 액션 타입을 하나로 묶는 유니언 타입 생성
export type Action = {
  [Type in keyof ActionMap]: {
    type: Type;
    payload: ActionMap[Type];
  };
}[keyof ActionMap];

export const initialState = {
  products: INITIAL_PRODUCTS,
  cartList: [],
  notifications: [],
  lastSelectedId: null,
  selectedProductId: PRODUCT_IDS.P1,
};

export function reducer(state: State, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case 'ADD_ITEM': {
      const { productId } = payload;
      const product = state.products.find((p) => p.id === productId);

      if (product && product.quantity <= 0) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            { id: Date.now(), message: '재고가 부족합니다.' },
          ],
        };
      }

      const existingItemIndex = state.cartList.findIndex((item) => item.productId === productId);

      const newCartList =
        existingItemIndex > -1
          ? state.cartList.map((item, index) =>
              index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item,
            )
          : [...state.cartList, { productId, quantity: 1 }];

      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
      );

      return { ...state, products: newProducts, cartList: newCartList };
    }

    case 'REMOVE_ITEM': {
      const { productId } = payload;
      const itemInCart = state.cartList.find((item) => item.productId === productId);
      if (!itemInCart) return state;

      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + itemInCart.quantity } : p,
      );
      const newCartList = state.cartList.filter((item) => item.productId !== productId);

      return { ...state, products: newProducts, cartList: newCartList };
    }

    case 'INCREASE_QUANTITY': {
      const { productId } = payload;
      const product = state.products.find((p) => p.id === productId);

      if (product.quantity <= 0) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            { id: Date.now(), message: '재고가 부족합니다.' },
          ],
        };
      }

      const newCartList = state.cartList.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
      );
      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
      );

      return { ...state, products: newProducts, cartList: newCartList };
    }

    case 'DECREASE_QUANTITY': {
      const { productId } = payload;
      let newCartList = state.cartList.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
      );

      newCartList = newCartList.filter((item) => item.quantity > 0);

      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + 1 } : p,
      );

      return { ...state, products: newProducts, cartList: newCartList };
    }

    case 'START_LIGHTNING_SALE': {
      const luckyIdx = Math.floor(Math.random() * state.products.length);
      const luckyItem = state.products[luckyIdx];

      const newProducts = state.products.map((p) =>
        p.id === luckyItem.id
          ? { ...p, price: Math.round((p.originalPrice * 80) / 100), onSale: true }
          : p,
      );
      const product = newProducts.find((p) => p.id === luckyItem.id);

      return {
        ...state,
        products: newProducts,
        notifications: [
          ...state.notifications,
          { id: Date.now(), message: `⚡번개세일! ${product.name}이(가) 20% 할인 중입니다!` },
        ],
      };
    }

    case 'START_SUGGEST_SALE': {
      if (!state.lastSelectedId) return state;

      const luckyItem = state.products.find(
        (p) => p.id !== state.lastSelectedId && p.quantity > 0 && !p.suggestSale,
      );

      if (!luckyItem) return state;

      const newProducts = state.products.map((p) =>
        p.id === luckyItem.id ? { ...p, price: Math.round(p.price * 0.95), suggestSale: true } : p,
      );

      return {
        ...state,
        products: newProducts,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            message: `💝 ${luckyItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
          },
        ],
      };
    }

    case 'SET_SELECTED_PRODUCT': {
      return { ...state, selectedProductId: payload.productId };
    }

    case 'SET_LAST_SELECTED': {
      return { ...state, lastSelectedId: payload.productId };
    }

    case 'REMOVE_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== payload.notificationId),
      };
    }

    default:
      return state;
  }
}

// getters
export const getProducts = (state) => state.products;
export const getCartList = (state) => state.cartList;
export const getSelectedId = (state) => state.selectedProductId;
export const getIsTuesday = () => new Date().getDay() === 2;

export const getCartDetails = (state) => {
  const products = getProducts(state);
  const cartList = getCartList(state);
  return cartList.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    return {
      ...cartItem,
      product,
      itemTotal: product.price * cartItem.quantity,
    };
  });
};

export const getTotalQuantity = (state) => {
  const cartDetails = getCartDetails(state);
  return cartDetails.reduce((sum, item) => sum + item.quantity, 0);
};

export const getSubtotal = (state) => {
  const cartDetails = getCartDetails(state);
  return cartDetails.reduce((sum, item) => sum + item.itemTotal, 0);
};

export const getDiscountResult = (state) => {
  const cartDetails = getCartDetails(state);
  const subtotal = getSubtotal(state);
  const totalQuantity = getTotalQuantity(state);
  const isTuesday = getIsTuesday();

  const baseDiscountRules = [
    {
      condition: totalQuantity >= 30,
      apply: () => ({
        total: subtotal * (1 - DISCOUNT_RATES.BULK),
        details: [{ reason: '🎉 대량구매 할인 (30개 이상)', amount: '25%' }],
      }),
    },
    {
      condition: true,
      apply: () => {
        const details = [];
        const total = cartDetails.reduce((acc, item) => {
          let itemDiscountRate = 0;
          const individualDiscount = DISCOUNT_RATES.INDIVIDUAL[item.productId];
          if (item.quantity >= 10 && individualDiscount) {
            itemDiscountRate = individualDiscount;
            details.push({
              reason: `${item.product.name} (10개↑)`,
              amount: `${itemDiscountRate * 100}%`,
            });
          }
          return acc + item.itemTotal * (1 - itemDiscountRate);
        }, 0);
        return { total, details };
      },
    },
  ];

  const { total: totalAfterBaseDiscount, details: baseDiscountDetails } = baseDiscountRules
    .find((rule) => rule.condition)
    .apply();

  let finalTotal = totalAfterBaseDiscount;
  const finalDiscountDetails = [...baseDiscountDetails];

  if (isTuesday && finalTotal > 0) {
    finalTotal *= 1 - DISCOUNT_RATES.TUESDAY;
    finalDiscountDetails.push({ reason: '🌟 화요일 추가 할인', amount: '10%' });
  }

  return { finalTotal, discounts: finalDiscountDetails };
};

export const getStockMessages = (state) => {
  const products = getProducts(state);
  return products
    .filter((p) => p.quantity < 5)
    .map((p) =>
      p.quantity > 0 ? `${p.name}: 재고 부족 (${p.quantity}개 남음)` : `${p.name}: 품절`,
    );
};

export const getBonusPoints = (state) => {
  const totalQuantity = getTotalQuantity(state);
  if (totalQuantity === 0) return { bonusPoints: 0, pointsDetail: [] };

  const { finalTotal } = getDiscountResult(state);
  const basePoints = Math.floor(finalTotal / 1000);
  const isTuesday = getIsTuesday();

  const has = (productId) => getCartList(state).some((item) => item.productId === productId);
  const hasKeyboard = has(PRODUCT_IDS.P1);
  const hasMouse = has(PRODUCT_IDS.P2);
  const hasMonitorArm = has(PRODUCT_IDS.P3);

  const cumulativeRules = [
    {
      condition: isTuesday && basePoints > 0,
      points: basePoints,
      detail: '화요일 2배',
    },
    {
      condition: hasKeyboard && hasMouse,
      points: POINTS.COMBO_KEYBOARD_MOUSE,
      detail: `키보드+마우스 세트 +${POINTS.COMBO_KEYBOARD_MOUSE}p`,
    },
    {
      condition: hasKeyboard && hasMouse && hasMonitorArm,
      points: POINTS.FULL_SET,
      detail: `풀세트 구매 +${POINTS.FULL_SET}p`,
    },
  ];

  const exclusiveRules = [
    {
      condition: totalQuantity >= 30,
      points: POINTS.BULK_L3,
      detail: `대량구매(30개+) +${POINTS.BULK_L3}p`,
    },
    {
      condition: totalQuantity >= 20,
      points: POINTS.BULK_L2,
      detail: `대량구매(20개+) +${POINTS.BULK_L2}p`,
    },
    {
      condition: totalQuantity >= 10,
      points: POINTS.BULK_L1,
      detail: `대량구매(10개+) +${POINTS.BULK_L1}p`,
    },
  ];

  const activeCumulativeBonuses = cumulativeRules.filter((rule) => rule.condition);

  const activeExclusiveBonus = exclusiveRules.find((rule) => rule.condition);

  const allActiveBonuses = [...activeCumulativeBonuses];
  if (activeExclusiveBonus) {
    allActiveBonuses.push(activeExclusiveBonus);
  }

  const totalBonusPoints = allActiveBonuses.reduce((sum, rule) => sum + rule.points, basePoints);

  const pointsDetail = basePoints > 0 ? [`기본: ${basePoints}p`] : [];
  allActiveBonuses.forEach((rule) => pointsDetail.push(rule.detail));

  return { bonusPoints: totalBonusPoints, pointsDetail };
};

export const getCartSummary = (state) => {
  const { finalTotal, discounts } = getDiscountResult(state);
  const { bonusPoints, pointsDetail } = getBonusPoints(state);
  const subtotal = getSubtotal(state);
  const savedAmount = subtotal - finalTotal;

  return {
    subtotal,
    finalTotal,
    discounts,
    savedAmount,
    bonusPoints,
    pointsDetail,
    totalQuantity: getTotalQuantity(state),
    isTuesday: getIsTuesday(),
    stockMessages: getStockMessages(state),
    totalDiscountRate: subtotal > 0 ? savedAmount / subtotal : 0,
    cartItemsForDisplay: getCartDetails(state).map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      totalPrice: item.itemTotal,
    })),
  };
};
