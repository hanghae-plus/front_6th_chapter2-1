/**
 * 상품 관련 타입 정의
 */
export interface Product {
  /** 상품 ID */
  id: string;
  /** 상품명 */
  name: string;
  /** 현재 가격 */
  val: number;
  /** 원래 가격 (할인 전) */
  originalVal: number;
  /** 재고 수량 */
  q: number;
  /** 번개세일 적용 여부 */
  onSale: boolean;
  /** 추천세일 적용 여부 */
  suggestSale: boolean;
}
