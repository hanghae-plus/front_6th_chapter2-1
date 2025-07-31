import type { Product } from '../stores/products';
import { formatPrice } from '../utils/price';
import { isSoldOut } from '../utils/quantity';
import { getSaleRecord, hasNoneSale } from '../utils/sale-event';

interface Props {
  products: Product[];
  productId: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function ProductSelect({ products, productId, onChange }: Props) {
  return (
    <select
      value={productId}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
    >
      {products.map((product) => {
        const { textContent, ...props } = getOptionProps(product);

        return (
          <option key={product.id} {...props}>
            {textContent}
          </option>
        );
      })}
    </select>
  );
}

function getOptionProps(product: Product): {
  value: string;
  disabled?: boolean;
  className?: string;
  textContent: string;
} {
  const { id, name, price, originalPrice } = product;
  const saleRecord = getSaleRecord(product.saleEvent);
  const formattedPrice = formatPrice({ price });
  const formattedOriginalPrice = formatPrice({ price: originalPrice });

  if (isSoldOut(product)) {
    return {
      value: id,
      disabled: true,
      className: 'text-gray-400',
      textContent: `${name} - ${formattedPrice}원 (품절) ${saleRecord.emojiWithText}`,
    };
  }

  if (hasNoneSale(product)) {
    return {
      value: id,
      textContent: `${name} - ${formattedPrice}원`,
    };
  }

  return {
    value: id,
    className: Object.values(saleRecord.className).join(' '),
    textContent: `${saleRecord.emoji}${name} - ${formattedOriginalPrice}원 → ${formattedPrice}원 (${saleRecord.text})`,
  };
}
