import type { CartItem as CartItemData } from "../../../shared";
import { MinusIcon, PlusIcon } from "../../../shared/components/icons";
import { QUANTITY_THRESHOLDS } from "../../../shared/constants";
import type { Product } from "../../product-selection";

type CartItemProps = {
	cartItem: CartItemData;
	product: Product;
	onQuantityChange: (productId: string, change: number) => void;
	onRemove: (productId: string) => void;
};

const getDiscountIcon = (product: Product): string => {
	if (product.onSale && product.suggestSale) return "⚡💝";
	if (product.onSale) return "⚡";
	if (product.suggestSale) return "💝";
	return "";
};

const getPriceColorClass = (product: Product): string => {
	if (product.onSale && product.suggestSale) return "text-purple-600";
	if (product.onSale) return "text-red-500";
	if (product.suggestSale) return "text-blue-500";
	return "";
};

const hasDiscount = (product: Product): boolean => {
	return product.onSale || product.suggestSale;
};

export function CartItem({ cartItem, product, onQuantityChange, onRemove }: CartItemProps) {
	const discountIcon = getDiscountIcon(product);
	const priceColorClass = getPriceColorClass(product);
	const isDiscounted = hasDiscount(product);
	const isBulkQuantity = cartItem.quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT;

	return (
		<div
			id={cartItem.id}
			className="grid grid-cols-[80px_1fr_auto] gap-5 border-b border-gray-100 py-5 first:pt-0 last:border-b-0 last:pb-0"
		>
			<div className="bg-gradient-black relative h-20 w-20 overflow-hidden">
				<div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/10"></div>
			</div>

			<div>
				<h3 className="mb-1 text-base font-normal tracking-tight">
					{discountIcon}
					{product.name}
				</h3>
				<p className="mb-0.5 text-xs tracking-wide text-gray-500">PRODUCT</p>
				<p className="mb-3 text-xs text-black">
					{isDiscounted ? (
						<>
							<span className="text-gray-400 line-through">
								₩{product.originalPrice.toLocaleString()}
							</span>{" "}
							<span className={priceColorClass}>₩{product.price.toLocaleString()}</span>
						</>
					) : (
						`₩${product.price.toLocaleString()}`
					)}
				</p>

				<div className="flex items-center gap-4">
					<button
						className="quantity-change flex h-6 w-6 items-center justify-center border border-black bg-white text-sm transition-all hover:bg-black hover:text-white"
						data-change="-1"
						onClick={() => onQuantityChange(cartItem.id, -1)}
					>
						<MinusIcon />
					</button>
					<span className="quantity-number min-w-[20px] text-center text-sm font-normal tabular-nums">
						{cartItem.quantity}
					</span>
					<button
						className="quantity-change flex h-6 w-6 items-center justify-center border border-black bg-white text-sm transition-all hover:bg-black hover:text-white"
						data-change="1"
						onClick={() => onQuantityChange(cartItem.id, 1)}
					>
						<PlusIcon />
					</button>
				</div>
			</div>

			<div className="text-right">
				<div
					className="mb-2 text-lg tabular-nums tracking-tight"
					style={{ fontWeight: isBulkQuantity ? "bold" : "normal" }}
				>
					{isDiscounted ? (
						<>
							<span className="text-gray-400 line-through">
								₩{product.originalPrice.toLocaleString()}
							</span>{" "}
							<span className={priceColorClass}>₩{product.price.toLocaleString()}</span>
						</>
					) : (
						`₩${product.price.toLocaleString()}`
					)}
				</div>
				<button
					className="remove-item text-2xs cursor-pointer border-b border-transparent uppercase tracking-wider text-gray-500 transition-colors hover:border-black hover:text-black"
					onClick={() => onRemove(cartItem.id)}
				>
					Remove
				</button>
			</div>
		</div>
	);
}
