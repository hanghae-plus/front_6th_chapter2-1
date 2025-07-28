import { PRICES, INITIAL_STOCK } from "../constants/index.js";

export const PRODUCT_LIST = [
  {
    id: "p1",
    name: "버그 없애는 키보드",
    price: PRICES.KEYBOARD,
    originalPrice: PRICES.KEYBOARD,
    quantity: INITIAL_STOCK.KEYBOARD,
    onSale: false,
    suggestSale: false,
  },
  {
    id: "p2",
    name: "생산성 폭발 마우스",
    price: PRICES.MOUSE,
    originalPrice: PRICES.MOUSE,
    quantity: INITIAL_STOCK.MOUSE,
    onSale: false,
    suggestSale: false,
  },
  {
    id: "p3",
    name: "거북목 탈출 모니터암",
    price: PRICES.MONITOR_ARM,
    originalPrice: PRICES.MONITOR_ARM,
    quantity: INITIAL_STOCK.MONITOR_ARM,
    onSale: false,
    suggestSale: false,
  },
  {
    id: "p4",
    name: "에러 방지 노트북 파우치",
    price: PRICES.LAPTOP_POUCH,
    originalPrice: PRICES.LAPTOP_POUCH,
    quantity: INITIAL_STOCK.LAPTOP_POUCH,
    onSale: false,
    suggestSale: false,
  },
  {
    id: "p5",
    name: "코딩할 때 듣는 Lo-Fi 스피커",
    price: PRICES.SPEAKER,
    originalPrice: PRICES.SPEAKER,
    quantity: INITIAL_STOCK.SPEAKER,
    onSale: false,
    suggestSale: false,
  },
];
