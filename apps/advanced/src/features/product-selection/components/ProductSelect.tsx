import { shouldShowStockWarning } from "../services";
import type { ProductSelectionProps } from "../types";
import { ProductOption } from "./ProductOption";

export function ProductSelect({
	products,
	selectedProductId,
	onProductSelect,
	onAddToCart,
	stockMessage,
	totalStock
}: ProductSelectionProps) {
	return (
		<div className="mb-6 border-b border-gray-200 pb-6">
			{/* 상품 선택 드롭다운 */}
			<select
				id="product-select"
				className="mb-3 w-full rounded-lg border border-gray-300 p-3 text-base"
				style={{ borderColor: shouldShowStockWarning(totalStock) ? "orange" : "" }}
				value={selectedProductId}
				onChange={(e) => onProductSelect(e.target.value)}
			>
				<option value="">상품을 선택하세요</option>
				{products.map((product) => (
					<ProductOption key={product.id} product={product} />
				))}
			</select>

			{/* 장바구니 추가 버튼 */}
			<button
				id="add-to-cart"
				className="w-full bg-black py-3 text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-gray-800"
				onClick={onAddToCart}
			>
				Add to Cart
			</button>

			{/* 재고 상태 메시지 */}
			<div id="stock-status" className="mt-3 whitespace-pre-line text-xs text-red-500">
				{stockMessage}
			</div>
		</div>
	);
}
