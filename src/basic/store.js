const PRODUCT_IDS = {
  P1: 'p1', // 버그 없애는 키보드
  P2: 'p2', // 생산성 폭발 마우스
  P3: 'p3', // 거북목 탈출 모니터암
  P4: 'p4', // 에러 방지 노트북 파우치
  P5: 'p5', // 코딩할 때 듣는 Lo-Fi 스피커
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

export { state, subscribe, dispatch };
