/**
 * 공통 타입 정의
 * 여러 도메인에서 공통으로 사용되는 타입들
 */

export interface IProduct {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  q: number;
  onSale: boolean;
  suggestSale: boolean;
}
