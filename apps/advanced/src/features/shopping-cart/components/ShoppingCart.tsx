import type { ShoppingCartProps } from "../types";
import { CartItem } from "./CartItem";

export function ShoppingCart({
	cartItems,
	products,
	onQuantityChange,
	onRemove
}: ShoppingCartProps) {
	return (
		<div id="cart-items">
			{cartItems.map((cartItem) => {
				const product = products.find((p) => p.id === cartItem.id);
				if (!product) return null;

				return (
					<CartItem
						key={cartItem.id}
						cartItem={cartItem}
						product={product}
						onQuantityChange={onQuantityChange}
						onRemove={onRemove}
					/>
				);
			})}
		</div>
	);
}
