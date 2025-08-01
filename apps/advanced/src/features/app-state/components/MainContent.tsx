import type { CartItem } from "../../../shared";
import { OrderSummary } from "../../order-summary";
import { ProductSelect, type Product } from "../../product-selection";
import { ShoppingCart } from "../../shopping-cart";

interface MainContentProps {
	products: Product[];
	cartItems: CartItem[];
	selectedProductId: string;
	stockMessage: string;
	totalStock: number;
	calculations: any;
	onProductSelect: (productId: string) => void;
	onAddToCart: () => void;
	onQuantityChange: (productId: string, newQuantity: number) => void;
	onRemove: (productId: string) => void;
}

export function MainContent({
	products,
	cartItems,
	selectedProductId,
	stockMessage,
	totalStock,
	calculations,
	onProductSelect,
	onAddToCart,
	onQuantityChange,
	onRemove
}: MainContentProps) {
	return (
		<div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[1fr_360px]">
			<div className="overflow-y-auto border border-gray-200 bg-white p-8">
				<ProductSelect
					products={products}
					selectedProductId={selectedProductId}
					onProductSelect={onProductSelect}
					onAddToCart={onAddToCart}
					stockMessage={stockMessage}
					totalStock={totalStock}
				/>
				<ShoppingCart
					cartItems={cartItems}
					products={products}
					onQuantityChange={onQuantityChange}
					onRemove={onRemove}
				/>
			</div>
			<OrderSummary cartItems={cartItems} products={products} calculations={calculations} />
		</div>
	);
}
