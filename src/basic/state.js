import { PRODUCT_ID_KEYBOARD, PRODUCT_ID_MOUSE, PRODUCT_ID_MONITOR_ARM, PRODUCT_ID_POUCH, PRODUCT_ID_SPEAKER } from "./constants.js";

export const state = {
    productList: [
        { id: PRODUCT_ID_KEYBOARD, name: '버그 없애는 키보드', price: 10000, stock: 50, originalPrice: 10000, onSale: false, suggest: false },
        { id: PRODUCT_ID_MOUSE, name: '생산성 폭발 마우스', price: 20000, stock: 30, originalPrice: 20000, onSale: false, suggest: false },
        { id: PRODUCT_ID_MONITOR_ARM, name: '거북목 탈출 모니터암', price: 30000, stock: 20, originalPrice: 30000, onSale: false, suggest: false },
        { id: PRODUCT_ID_POUCH, name: '에러 방지 노트북 파우치', price: 15000, stock: 0, originalPrice: 15000, onSale: false, suggest: false },
        { id: PRODUCT_ID_SPEAKER, name: '코딩할 때 듣는 Lo-Fi 스피커', price: 25000, stock: 10, originalPrice: 25000, onSale: false, suggest: false },
    ],
    cartItems: [],
    lastSelectedProduct: null,
    totals: { itemCnt: 0, amount: 0, discountRate: 0 },
    bonus: { point: 0, details: [] },
};