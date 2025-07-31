/**
 * 장바구니 아이템 타입
 */
export interface CartItem {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}
