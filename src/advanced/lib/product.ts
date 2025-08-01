// 상품 타입
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discount: number;
  lightningSale?: boolean;
  recommendationSale?: boolean;
}

// 장바구니 아이템 타입
export interface CartItem {
  product: Product;
  quantity: number;
  appliedDiscounts: string[];
}

export const PRODUCTS = [
  {
    id: 'p1',
    name: '버그 없애는 키보드',
    price: 10000,
    stock: 50,
    discount: 0.1,
    lightningSale: false,
    recommendationSale: false,
  },
  {
    id: 'p2',
    name: '생산성 폭발 마우스',
    price: 20000,
    stock: 30,
    discount: 0.15,
    lightningSale: false,
    recommendationSale: false,
  },
  {
    id: 'p3',
    name: '거북목 탈출 모니터암',
    price: 30000,
    stock: 20,
    discount: 0.2,
    lightningSale: false,
    recommendationSale: false,
  },
  {
    id: 'p4',
    name: '에러 방지 노트북 파우치',
    price: 15000,
    stock: 0,
    discount: 0.05,
    lightningSale: false,
    recommendationSale: false,
  },
  {
    id: 'p5',
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    price: 25000,
    stock: 10,
    discount: 0.25,
    lightningSale: false,
    recommendationSale: false,
  },
];

// useCart 훅에서 사용할 initialProducts
export const initialProducts: Product[] = PRODUCTS;
