import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '버그 없애는 키보드',
    price: 10000,
    stock: 50,
    discount: 10,
  },
  {
    id: 'p2',
    name: '생산성 폭발 마우스',
    price: 20000,
    stock: 30,
    discount: 15,
  },
  {
    id: 'p3',
    name: '거북목 탈출 모니터암',
    price: 30000,
    stock: 20,
    discount: 20,
  },
  {
    id: 'p4',
    name: '에러 방지 노트북 파우치',
    price: 15000,
    stock: 0,
    discount: 5,
  },
  {
    id: 'p5',
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    price: 25000,
    stock: 10,
    discount: 25,
  },
];

// 상품 ID로 상품 찾기
export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find((product) => product.id === id);
};

// 재고 부족 상품 찾기 (5개 미만)
export const getLowStockProducts = (): Product[] => {
  return PRODUCTS.filter((product) => product.stock > 0 && product.stock < 5);
};

// 품절 상품 찾기
export const getOutOfStockProducts = (): Product[] => {
  return PRODUCTS.filter((product) => product.stock === 0);
};
