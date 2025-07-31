import { hasNoneSale, isSoldOut, type Product } from '../../model/products';
import { getSaleRecord, saleEmojiWithText } from '../../model/sale-event';
import { html } from '../../utils/html';

export function ProductSelectOption(product: Product) {
  if (isSoldOut(product)) {
    return SoldOutOption(product);
  }

  if (hasNoneSale(product)) {
    return NoneSaleOption(product);
  }

  return SaleOption(product);
}

function SoldOutOption(product: Product) {
  const { name, price } = product;
  const textContext = [`${name} - ${price}원 (품절)`];

  if (!hasNoneSale(product)) {
    textContext.push(saleEmojiWithText(product.saleEvent));
  }

  return Option({
    ...product,
    disabled: true,
    className: 'text-gray-400',
    textContent: textContext.join(' '),
  });
}

function NoneSaleOption(product: Product) {
  const { name, price } = product;

  return Option({
    ...product,
    textContent: `${name} - ${price}원`,
  });
}

function SaleOption(product: Product) {
  const { name, price, originalPrice } = product;
  const saleRecord = getSaleRecord(product.saleEvent);

  return Option({
    ...product,
    className: Object.values(saleRecord.className).join(' '),
    textContent: `${saleRecord.emoji}${name} - ${originalPrice}원 → ${price}원 (${saleRecord.text})`,
  });
}

interface OptionProps extends Product {
  textContent: string;
  className?: string;
  disabled?: boolean;
}

function Option({ id, textContent, className, disabled }: OptionProps) {
  return html`<option
    value="${id}"
    ${disabled ? 'disabled' : ''}
    ${className ? className : ''}
  >
    ${textContent}
  </option>`;
}
