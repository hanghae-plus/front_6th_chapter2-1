import { PRICES, INITIAL_STOCK, PRODUCT_IDS } from "../constants/index.js";

// 상품 목록 데이터
// data/ 폴더에 위치하는 이유:
// 1. 복잡한 데이터 구조 (단순 상수가 아님)
// 2. 향후 API 연동 시 자연스러운 위치
// 3. 테스트에서 모킹 용이
export const PRODUCT_LIST = [
  {
    id: PRODUCT_IDS.KEYBOARD,
    name: "버그 없애는 키보드",
    price: PRICES.KEYBOARD,
    originalPrice: PRICES.KEYBOARD,
    quantity: INITIAL_STOCK.KEYBOARD,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.MOUSE,
    name: "생산성 폭발 마우스",
    price: PRICES.MOUSE,
    originalPrice: PRICES.MOUSE,
    quantity: INITIAL_STOCK.MOUSE,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.MONITOR_ARM,
    name: "거북목 탈출 모니터암",
    price: PRICES.MONITOR_ARM,
    originalPrice: PRICES.MONITOR_ARM,
    quantity: INITIAL_STOCK.MONITOR_ARM,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.LAPTOP_POUCH,
    name: "에러 방지 노트북 파우치",
    price: PRICES.LAPTOP_POUCH,
    originalPrice: PRICES.LAPTOP_POUCH,
    quantity: INITIAL_STOCK.LAPTOP_POUCH,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.SPEAKER,
    name: "코딩할 때 듣는 Lo-Fi 스피커",
    price: PRICES.SPEAKER,
    originalPrice: PRICES.SPEAKER,
    quantity: INITIAL_STOCK.SPEAKER,
    onSale: false,
    suggestSale: false,
  },
];
