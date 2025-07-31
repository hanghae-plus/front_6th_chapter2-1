export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
  discountRate: number;
}
