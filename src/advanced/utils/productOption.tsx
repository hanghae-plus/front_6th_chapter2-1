import { Product } from '@/types/product';

// 상품 옵션 라벨을 JSX로 반환하는 컴포넌트
export function ProductOptionLabel({ product }: { product: Product }) {
  if (product.quantity === 0) {
    return (
      <span className="text-gray-400">
        {product.name} - {product.discountPrice.toLocaleString()}원 (품절)
      </span>
    );
  } else if (product.onSale && product.suggestSale) {
    return (
      <span className="text-purple-600 font-bold">
        ⚡💝{product.name} - {product.price.toLocaleString()}원 → {product.discountPrice.toLocaleString()}원 (25% SUPER
        SALE!)
      </span>
    );
  } else if (product.onSale) {
    return (
      <span className="text-red-500 font-bold">
        ⚡{product.name} - {product.price.toLocaleString()}원 → {product.discountPrice.toLocaleString()}원 (20% SALE!)
      </span>
    );
  } else if (product.suggestSale) {
    return (
      <span className="text-blue-500 font-bold">
        💝{product.name} - {product.price.toLocaleString()}원 → {product.discountPrice.toLocaleString()}원 (5%
        추천할인!)
      </span>
    );
  } else {
    return (
      <span>
        {product.name} - {product.discountPrice.toLocaleString()}원
      </span>
    );
  }
}
