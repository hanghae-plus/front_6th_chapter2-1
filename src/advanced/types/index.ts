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
  id: Date;
  message: string;
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
  REMOVE_NOTIFICATION: { notificationId: Date };
};

// 모든 액션 타입을 하나로 묶는 유니언 타입 생성
export type Action = {
  [Type in keyof ActionMap]: {
    type: Type;
    payload: ActionMap[Type];
  };
}[keyof ActionMap];
