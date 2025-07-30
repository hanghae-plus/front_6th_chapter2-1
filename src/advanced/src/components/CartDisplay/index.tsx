import AddToCartSection from '../AddToCartSection';
import CartItem from './CartItem';

interface CartItemData {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  quantity: number;
  saleIcon?: string;
}
const mockCartItems: CartItemData[] = [
  {
    id: 'p2',
    name: '생산성 폭발 마우스',
    originalPrice: 20000,
    price: 15200,
    quantity: 5,
    saleIcon: '⚡💝',
  },
  {
    id: 'p1',
    name: '버그 없애는 키보드',
    originalPrice: 10000,
    price: 8000,
    quantity: 1,
    saleIcon: '⚡',
  },
];

export default function CartDisplay() {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <AddToCartSection />
      <div id="cart-items">
        {mockCartItems.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            name={item.name}
            originalPrice={item.originalPrice}
            price={item.price}
            quantity={item.quantity}
            saleIcon={item.saleIcon}
          />
        ))}
      </div>
    </div>
  );
}
