/**
 * 장바구니 상태 선택자
 * 장바구니 데이터에 대한 읽기 전용 접근 제공
 */
import type { CartState } from './reducer';
import type { CartItem } from '../../../shared/types';

export const cartSelectors = {
  // 장바구니 전체 아이템 목록
  getItems: (state: CartState): CartItem[] => state.items,

  // 장바구니 총 아이템 개수
  getItemCount: (state: CartState): number =>
    state.items.reduce((total, item) => total + item.quantity, 0),

  // 특정 ID 아이템 조회
  getItemById: (state: CartState, id: string): CartItem | undefined =>
    state.items.find((item) => item.id === id),

  // 장바구니가 비어있는지 확인
  isEmpty: (state: CartState): boolean => state.items.length === 0,

  // 특정 상품이 장바구니에 있는지 확인
  hasItem: (state: CartState, id: string): boolean =>
    state.items.some((item) => item.id === id),
};
