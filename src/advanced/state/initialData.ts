// src/advanced/state/initialData.ts
import { Product } from '../types';
import { PRODUCT_ID } from '../../basic/constants'; // 기존 상수 재활용

export const initialProducts: Product[] = [
  { id: PRODUCT_ID.P1, name: '버그 없애는 키보드', val: 10000, originalVal: 10000, q: 50, onSale: false, suggestSale: false },
  { id: PRODUCT_ID.P2, name: '생산성 폭발 마우스', val: 20000, originalVal: 20000, q: 30, onSale: false, suggestSale: false },
  { id: PRODUCT_ID.P3, name: '거북목 탈출 모니터암', val: 30000, originalVal: 30000, q: 20, onSale: false, suggestSale: false },
  { id: PRODUCT_ID.P4, name: '에러 방지 노트북 파우치', val: 15000, originalVal: 15000, q: 0, onSale: false, suggestSale: false },
  { id: PRODUCT_ID.P5, name: '코딩할 때 듣는 Lo-Fi 스피커', val: 25000, originalVal: 25000, q: 10, onSale: false, suggestSale: false },
];
