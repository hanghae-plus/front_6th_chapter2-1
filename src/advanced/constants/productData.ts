import { PRODUCT_IDS } from "./business";

// 상품 초기 데이터
export const INITIAL_PRODUCTS = [
  {
    id: PRODUCT_IDS.KEYBOARD,
    name: "버그 없애는 키보드",
    price: 10000,
    originalPrice: 10000,
    quantity: 50,
    isOnLightningSale: false,
    isSuggestedSale: false,
  },
  {
    id: PRODUCT_IDS.MOUSE,
    name: "생산성 폭발 마우스",
    price: 20000,
    originalPrice: 20000,
    quantity: 30,
    isOnLightningSale: false,
    isSuggestedSale: false,
  },
  {
    id: PRODUCT_IDS.MONITOR_ARM,
    name: "거북목 탈출 모니터암",
    price: 30000,
    originalPrice: 30000,
    quantity: 20,
    isOnLightningSale: false,
    isSuggestedSale: false,
  },
  {
    id: PRODUCT_IDS.LAPTOP_POUCH,
    name: "에러 방지 노트북 파우치",
    price: 15000,
    originalPrice: 15000,
    quantity: 0,
    isOnLightningSale: false,
    isSuggestedSale: false,
  },
  {
    id: PRODUCT_IDS.SPEAKER,
    name: "코딩할 때 듣는 Lo-Fi 스피커",
    price: 25000,
    originalPrice: 25000,
    quantity: 10,
    isOnLightningSale: false,
    isSuggestedSale: false,
  },
];
