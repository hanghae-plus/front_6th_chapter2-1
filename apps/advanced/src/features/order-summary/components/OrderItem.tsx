import type { CartItem, Product } from "../../../shared";
import { calculateOrderItemTotal } from "../services";

type OrderItemProps = {
	cartItem: CartItem;
	product: Product;
};

export function OrderItem({ cartItem, product }: OrderItemProps) {
	const itemTotal = calculateOrderItemTotal(cartItem, product);

	return (
		<div className="flex justify-between text-xs tracking-wide text-gray-400">
			<span>
				{product.name} x {cartItem.quantity}
			</span>
			<span>₩{itemTotal.toLocaleString()}</span>
		</div>
	);
}
