import { generateProductOptionText } from "../services";
import type { Product } from "../types";

type ProductOptionProps = {
	product: Product;
};

export function ProductOption({ product }: ProductOptionProps) {
	// 할인 텍스트 생성 (품절이 아닌 경우)
	let discountText = "";
	if (product.onSale) discountText += " ⚡SALE";
	if (product.suggestSale) discountText += " 💝추천";

	// 품절 상품 처리
	if (product.stock === 0) {
		return (
			<option key={product.id} value={product.id} disabled className="text-gray-400">
				{product.name} - {product.price}원 (품절){discountText}
			</option>
		);
	}

	// 일반 상품 처리
	const { text, className } = generateProductOptionText(product);
	const displayText = className ? text : `${text}${discountText}`;

	return (
		<option key={product.id} value={product.id} className={className}>
			{displayText}
		</option>
	);
}
