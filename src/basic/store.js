const PRODUCT_IDS = {
  P1: 'p1', // 버그 없애는 키보드
  P2: 'p2', // 생산성 폭발 마우스
  P3: 'p3', // 거북목 탈출 모니터암
  P4: 'p4', // 에러 방지 노트북 파우치
  P5: 'p5', // 코딩할 때 듣는 Lo-Fi 스피커
};

const DISCOUNT_RATES = {
  INDIVIDUAL: {
    [PRODUCT_IDS.P1]: 0.1,
    [PRODUCT_IDS.P2]: 0.15,
    [PRODUCT_IDS.P3]: 0.2,
    [PRODUCT_IDS.P5]: 0.25,
  },
  BULK: 0.25,
  TUESDAY: 0.1,
};

const state = {
  lastSelectedId: null,
  products: [
    {
      id: PRODUCT_IDS.P1,
      name: '버그 없애는 키보드',
      price: 10000,
      originalPrice: 10000,
      quantity: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.P2,
      name: '생산성 폭발 마우스',
      price: 20000,
      originalPrice: 20000,
      quantity: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.P3,
      name: '거북목 탈출 모니터암',
      price: 30000,
      originalPrice: 30000,
      quantity: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.P4,
      name: '에러 방지 노트북 파우치',
      price: 15000,
      originalPrice: 15000,
      quantity: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.P5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      price: 25000,
      originalPrice: 25000,
      quantity: 10,
      onSale: false,
      suggestSale: false,
    },
  ],
  cartList: [],
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
        window.alert('재고가 부족합니다.');
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
        alert('재고가 부족합니다.');
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
      break;
    }

    case 'SET_LAST_SELECTED': {
      state.lastSelectedId = payload.productId;
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

const getCartSummary = (state) => {
  const cartDetails = state.cartList.map((cartItem) => {
    const product = state.products.find((p) => p.id === cartItem.productId);
    return {
      ...cartItem,
      product,
      itemTotal: product.price * cartItem.quantity,
    };
  });

  const subtotal = cartDetails.reduce((sum, item) => sum + item.itemTotal, 0);
  const totalQuantity = cartDetails.reduce((sum, item) => sum + item.quantity, 0);

  const discounts = [];
  let totalAfterDiscounts = 0;

  if (totalQuantity >= 30) {
    totalAfterDiscounts = subtotal * (1 - DISCOUNT_RATES.BULK);
    discounts.push({ reason: '🎉 대량구매 할인 (30개 이상)', amount: '25%' });
  } else {
    let individualDiscountedTotal = 0;
    cartDetails.forEach((item) => {
      let itemDiscountRate = 0;
      const individualDiscount = DISCOUNT_RATES.INDIVIDUAL[item.productId];

      if (item.quantity >= 10 && individualDiscount) {
        itemDiscountRate = individualDiscount;
        discounts.push({
          reason: `${item.product.name} (10개↑)`,
          amount: `${itemDiscountRate * 100}%`,
        });
      }
      individualDiscountedTotal += item.itemTotal * (1 - itemDiscountRate);
    });
    totalAfterDiscounts = individualDiscountedTotal;
  }

  const isTuesday = new Date().getDay() === 2;
  let finalTotal = totalAfterDiscounts;
  if (isTuesday && finalTotal > 0) {
    finalTotal *= 1 - DISCOUNT_RATES.TUESDAY;
  }

  const savedAmount = subtotal - finalTotal;
  const totalDiscountRate = subtotal > 0 ? savedAmount / subtotal : 0;

  const stockMessages = state.products
    .filter((p) => p.quantity < 5)
    .map((p) =>
      p.quantity > 0 ? `${p.name}: 재고 부족 (${p.quantity}개 남음)` : `${p.name}: 품절`,
    );

  return {
    totalQuantity,
    subtotal,
    finalTotal,
    totalDiscountRate,
    savedAmount,
    discounts,
    isTuesday,
    stockMessages,
    cartItemsForDisplay: cartDetails.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      totalPrice: item.itemTotal,
    })),
  };
};

function getBonusPoints(state, summary) {
  if (summary.totalQuantity === 0) {
    return { bonusPoints: 0, pointsDetail: [] };
  }

  const basePoints = Math.floor(summary.finalTotal / 1000);
  let finalPoints = basePoints;
  const pointsDetail = basePoints > 0 ? [`기본: ${basePoints}p`] : [];

  if (new Date().getDay() === 2 && basePoints > 0) {
    finalPoints += basePoints;
    pointsDetail.push('화요일 2배');
  }

  const has = (productId) => state.cartList.some((item) => item.productId === productId);
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
  if (summary.totalQuantity >= 30) {
    finalPoints += 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (summary.totalQuantity >= 20) {
    finalPoints += 50;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (summary.totalQuantity >= 10) {
    finalPoints += 20;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  return { bonusPoints: finalPoints, pointsDetail };
}

export { state, subscribe, dispatch, getCartSummary, getBonusPoints };
