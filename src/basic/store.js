import { PRODUCT_IDS, DISCOUNT_RATES, INITIAL_PRODUCTS } from './constant';

const state = {
  products: INITIAL_PRODUCTS,
  cartList: [],
  notifications: [],
  selectedProductId: 'p1',
  lastSelectedId: null,
};

const listeners = [];

const subscribe = (listener) => {
  listeners.push(listener);
};

const dispatch = (action) => {
  const { type, payload } = action;

  switch (type) {
    case 'ADD_ITEM': {
      const { productId } = payload;
      const product = state.products.find((p) => p.id === productId);

      if (product.quantity > 0) {
        const existingItem = state.cartList.find((item) => item.productId === productId);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          state.cartList.push({ productId, quantity: 1 });
        }
        product.quantity--;
      } else {
        state.notifications.push({
          id: Date.now(),
          message: '재고가 부족합니다.',
        });
      }
      break;
    }

    case 'REMOVE_ITEM': {
      const { productId } = payload;
      const itemIndex = state.cartList.findIndex((item) => item.productId === productId);
      if (itemIndex === -1) break;

      const product = state.products.find((p) => p.id === productId);
      const itemInCart = state.cartList[itemIndex];
      product.quantity += itemInCart.quantity;
      state.cartList.splice(itemIndex, 1);
      break;
    }

    case 'INCREASE_QUANTITY': {
      const { productId } = payload;
      const product = state.products.find((p) => p.id === productId);

      if (product.quantity <= 0) {
        state.notifications.push({
          id: Date.now(),
          message: '재고가 부족합니다.',
        });
        break;
      }

      const itemInCart = state.cartList.find((item) => item.productId === productId);
      if (itemInCart) {
        product.quantity--;
        itemInCart.quantity++;
      }
      break;
    }

    case 'DECREASE_QUANTITY': {
      const { productId } = payload;
      const product = state.products.find((p) => p.id === productId);
      if (!product) break;

      const itemIndex = state.cartList.findIndex((item) => item.productId === productId);
      if (itemIndex === -1) break;

      const itemInCart = state.cartList[itemIndex];

      itemInCart.quantity--;
      product.quantity++;

      if (itemInCart.quantity <= 0) {
        state.cartList.splice(itemIndex, 1);
      }
      break;
    }

    case 'START_LIGHTNING_SALE': {
      const { productId } = payload;
      const product = state.products.find((p) => p.id === productId);
      if (product) {
        product.price = Math.round((product.originalPrice * 80) / 100);
        product.onSale = true;
        state.notifications.push({
          id: Date.now(),
          message: `⚡번개세일! ${product.name}이(가) 20% 할인 중입니다!`,
        });
      }
      break;
    }

    case 'START_SUGGEST_SALE': {
      const { productId } = payload;
      const product = state.products.find((p) => p.id === productId);
      if (product) {
        product.price = Math.round((product.price * 95) / 100);
        product.suggestSale = true;
      }
      state.notifications.push({
        id: Date.now(),
        message: `💝 ${luckyItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
      });
      break;
    }

    case 'SET_SELECTED_PRODUCT': {
      state.selectedProductId = payload.productId;
      break;
    }

    case 'SET_LAST_SELECTED': {
      state.lastSelectedId = payload.productId;
      break;
    }

    case 'REMOVE_NOTIFICATION': {
      const { notificationId } = payload;
      state.notifications = state.notifications.filter((n) => n.id !== notificationId);
      break;
    }
  }

  notify();
};

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

// getters
const getProducts = (state) => state.products;
const getCartList = (state) => state.cartList;
const getIsTuesday = () => new Date().getDay() === 2;

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
  const discounts = [];
  let totalAfterDiscounts = 0;

  if (totalQuantity >= 30) {
    totalAfterDiscounts = subtotal * (1 - DISCOUNT_RATES.BULK);
    discounts.push({ reason: '🎉 대량구매 할인 (30개 이상)', amount: '25%' });
  } else {
    totalAfterDiscounts = cartDetails.reduce((total, item) => {
      let itemDiscountRate = 0;
      const individualDiscount = DISCOUNT_RATES.INDIVIDUAL[item.productId];

      if (item.quantity >= 10 && individualDiscount) {
        itemDiscountRate = individualDiscount;
        discounts.push({
          reason: `${item.product.name} (10개↑)`,
          amount: `${itemDiscountRate * 100}%`,
        });
      }
      return total + item.itemTotal * (1 - itemDiscountRate);
    }, 0);
  }

  let finalTotal = totalAfterDiscounts;
  if (isTuesday && finalTotal > 0) {
    finalTotal *= 1 - DISCOUNT_RATES.TUESDAY;
  }

  return { finalTotal, discounts };
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
  let finalPoints = basePoints;
  const pointsDetail = basePoints > 0 ? [`기본: ${basePoints}p`] : [];

  if (getIsTuesday() && basePoints > 0) {
    finalPoints += basePoints;
    pointsDetail.push('화요일 2배');
  }

  const has = (productId) => getCartList(state).some((item) => item.productId === productId);
  const hasKeyboard = has(PRODUCT_IDS.P1);
  const hasMouse = has(PRODUCT_IDS.P2);
  const hasMonitorArm = has(PRODUCT_IDS.P3);

  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 100;
    pointsDetail.push('풀세트 구매 +100p');
  }
  if (totalQuantity >= 30) {
    finalPoints += 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (totalQuantity >= 20) {
    finalPoints += 50;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (totalQuantity >= 10) {
    finalPoints += 20;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  return { bonusPoints: finalPoints, pointsDetail };
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

export { state, subscribe, dispatch, getCartSummary };
