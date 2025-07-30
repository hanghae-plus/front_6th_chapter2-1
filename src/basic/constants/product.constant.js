const productIds = {
  p1: "p1",
  p2: "p2",
  p3: "p3",
  p4: "p4",
  p5: "p5",
};

const products = [
  {
    id: productIds.p1,
    name: "버그 없애는 키보드",
    val: 10000,
    originalVal: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: productIds.p2,
    name: "생산성 폭발 마우스",
    val: 20000,
    originalVal: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: productIds.p3,
    name: "거북목 탈출 모니터암",
    val: 30000,
    originalVal: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: productIds.p4,
    name: "에러 방지 노트북 파우치",
    val: 15000,
    originalVal: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: productIds.p5,
    name: "코딩할 때 듣는 Lo-Fi 스피커",
    val: 25000,
    originalVal: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];

export { productIds, products };
