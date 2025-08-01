/**
 * 공통 타입 정의
 */

export interface IProduct {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}
