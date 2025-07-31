import { CartItem } from "./CartItem";

interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
}

interface CartItemsProps {
  items: CartItemData[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItems = ({
  items,
  onQuantityChange,
  onRemove,
}: CartItemsProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        장바구니가 비어있습니다.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item) => (
        <CartItem
          key={item.id}
          {...item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
