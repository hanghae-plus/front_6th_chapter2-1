export const productList = [
  {
    id: 'p1',
    type: 'keyboard',
    name: '버그 없애는 키보드',
    value: 10000,
    originalValue: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: 'p2',
    type: 'mouse',
    name: '생산성 폭발 마우스',
    value: 20000,
    originalValue: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: 'p3',
    type: 'monitorArm',
    name: '거북목 탈출 모니터암',
    value: 30000,
    originalValue: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: 'p4',
    type: 'pouch',
    name: '에러 방지 노트북 파우치',
    value: 15000,
    originalValue: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: 'p5',
    type: 'speaker',
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    value: 25000,
    originalValue: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];

/**
 * @todo 자바스크립트라서 타입 추론이 되지 않는 문제가 있음
 * @description 상품 타입에 대한 아이디 객체
 */
export const productIds = productList.reduce((acc, product) => {
  acc[product.type] = product.id;

  return acc;
}, {});
