import { SummaryDetailItem } from '../components/grid/summary-detail-item';
import type { Cart } from '../model/cart';
import { selectById } from '../utils/selector';

interface Props {
  carts: Cart[];
  cartTotalCount: number;
  totalPrice: number;
}

export function renderSummaryDetails({
  carts,
  cartTotalCount,
  totalPrice,
}: Props) {
  const summaryDetails = selectById('summary-details');
  summaryDetails.innerHTML = SummaryDetailItem({
    carts,
    cartTotalCount,
    totalPrice,
  });
}
