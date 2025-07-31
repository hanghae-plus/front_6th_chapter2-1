export const KEYBOARD = 'p1';
export const MOUSE = 'p2';
export const MONITORARM = 'p3';
export const POUCH = 'p4';
export const SPEAKER = 'p5';

export const initialProducts = [
  {
    id: KEYBOARD,
    name: '버그 없애는 키보드',
    discountValue: 10000,
    originalVal: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MOUSE,
    name: '생산성 폭발 마우스',
    discountValue: 20000,
    originalVal: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MONITORARM,
    name: '거북목 탈출 모니터암',
    discountValue: 30000,
    originalVal: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: POUCH,
    name: '에러 방지 노트북 파우치',
    discountValue: 15000,
    originalVal: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    discountValue: 25000,
    originalVal: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];
