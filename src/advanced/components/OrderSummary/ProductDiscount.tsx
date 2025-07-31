import React, { memo } from "react";
import type { Product } from "../../types";

interface ProductDiscountProps {
  product: Product;
  discountRate: number;
}

const ProductDiscount: React.FC<ProductDiscountProps> = ({ product, discountRate }) => (
  <div className="flex justify-between text-sm tracking-wide text-green-400">
    <span className="text-xs">{product.name} (10개↑)</span>
    <span className="text-xs">-{discountRate}%</span>
  </div>
);

export default memo(ProductDiscount);
